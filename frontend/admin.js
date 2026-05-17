let allMessages = [];
let currentMessageId = null;


const subjectLabels = {
    general: 'General enquiry',
    prayer: 'Prayer request',
    visit: 'Planning a visit',
    ministry: 'Ministry involvement',
    giving: 'Giving & tithes',
    other: 'Other'
};

function displaySubject(subject) {
    return subjectLabels[subject] || subject || 'No subject';
}

// Load messages on page load
document.addEventListener('DOMContentLoaded', () => {
    loadMessages();
    
    // Add search functionality
    document.getElementById('search-box').addEventListener('input', (e) => {
        filterMessages(e.target.value);
    });
});

async function loadMessages() {
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error-message');
    const tableEl = document.getElementById('messages-table');
    const emptyEl = document.getElementById('empty-state');
    const bodyEl = document.getElementById('messages-body');
    
    loadingEl.style.display = 'block';
    errorEl.style.display = 'none';
    tableEl.style.display = 'none';
    emptyEl.style.display = 'none';
    
    try {
        const response = await fetch(`${API_BASE}/api/contact`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch messages');
        }
        
        allMessages = await response.json();
        
        // Update total count
        document.getElementById('total-count').textContent = allMessages.length;
        
        // Render messages
        if (allMessages.length === 0) {
            emptyEl.style.display = 'block';
        } else {
            bodyEl.innerHTML = '';
            allMessages.forEach(msg => {
                const row = createMessageRow(msg);
                bodyEl.appendChild(row);
            });
            tableEl.style.display = 'table';
        }
    } catch (error) {
        errorEl.textContent = '❌ Error loading messages: ' + error.message;
        errorEl.style.display = 'block';
    } finally {
        loadingEl.style.display = 'none';
    }
}

function createMessageRow(msg) {
    const row = document.createElement('tr');
    const date = new Date(msg.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    row.innerHTML = `
        <td>${escapeHtml(msg.name)}</td>
        <td>${escapeHtml(msg.email)}</td>
        <td>${escapeHtml(displaySubject(msg.subject))}</td>
        <td><span class="message-preview">${escapeHtml(msg.message)}</span></td>
        <td><span class="date-cell">${date}</span></td>
        <td>
            <button class="btn-view" onclick="viewMessage(${msg.id})">View</button>
            <button class="btn-view" onclick="replyMessage(${msg.id})">Reply</button>
            <button class="btn-delete" onclick="deleteMessage(${msg.id})">Delete</button>
        </td>
    `;
    
    return row;
}

function filterMessages(searchTerm) {
    const tableEl = document.getElementById('messages-table');
    const bodyEl = document.getElementById('messages-body');
    const emptyEl = document.getElementById('empty-state');
    
    const filtered = allMessages.filter(msg => 
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    bodyEl.innerHTML = '';
    
    if (filtered.length === 0) {
        tableEl.style.display = 'none';
        emptyEl.style.display = 'block';
        emptyEl.innerHTML = '<h2>No Messages Found</h2><p>Try adjusting your search criteria.</p>';
    } else {
        filtered.forEach(msg => {
            const row = createMessageRow(msg);
            bodyEl.appendChild(row);
        });
        tableEl.style.display = 'table';
        emptyEl.style.display = 'none';
    }
}

function viewMessage(id) {
    const msg = allMessages.find(m => m.id === id);
    if (!msg) return;
    
    currentMessageId = id;
    const date = new Date(msg.createdAt).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    document.getElementById('modal-name').textContent = msg.name;
    document.getElementById('modal-email').textContent = msg.email;
    document.getElementById('modal-subject').textContent = displaySubject(msg.subject);
    document.getElementById('modal-message').textContent = msg.message;
    document.getElementById('modal-date').textContent = date;
    
    // CHANGE THIS LINE - use 'show' instead of 'active'
    document.getElementById('message-modal').classList.add('show');
}

function replyMessage(id) {
    const msg = allMessages.find(m => m.id === id);
    if (!msg) return;
    const subject = encodeURIComponent(`Re: ${displaySubject(msg.subject)}`);
    const body = encodeURIComponent(`Hello ${msg.name},\n\nThank you for your message.\n\nOriginal message:\n${msg.message}\n\nBest regards,\n`);
    window.location.href = `mailto:${msg.email}?subject=${subject}&body=${body}`;
}

function replyFromModal() {
    if (currentMessageId) {
        replyMessage(currentMessageId);
    }
}

function closeModal() {
    document.getElementById('message-modal').classList.remove('show');
    currentMessageId = null;
}

async function deleteMessage(id) {
    if (!confirm('Are you sure you want to delete this message?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/api/contact/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete message');
        }
        
        allMessages = allMessages.filter(m => m.id !== id);
        loadMessages();
        alert('Message deleted successfully');
    } catch (error) {
        alert('Error deleting message: ' + error.message);
    }
}

function deleteFromModal() {
    if (currentMessageId) {
        deleteMessage(currentMessageId);
        closeModal();
    }
}

function exportToCSV() {
    if (allMessages.length === 0) {
        alert('No messages to export');
        return;
    }
    
    let csv = 'Name,Email,Subject,Message,Date\n';
    
    allMessages.forEach(msg => {
        const date = new Date(msg.createdAt).toLocaleString();
        const name = `"${msg.name.replace(/"/g, '""')}"`;
        const email = `"${msg.email.replace(/"/g, '""')}"`;
        const subject = `"${displaySubject(msg.subject).replace(/"/g, '""')}"`;
        const message = `"${msg.message.replace(/"/g, '""')}"`;
        
        csv += `${name},${email},${subject},${message},"${date}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `church_messages_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Close modal when clicking outside of it
document.addEventListener('click', (e) => {
    const modal = document.getElementById('message-modal');
    if (e.target === modal) {
        closeModal();
    }
});
