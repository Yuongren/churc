/* Live character counter */
function updateCharCount(el) {
    document.getElementById('char-count').textContent =
    el.value.length + ' / 1000';
}

const API_BASE = 'https://churc.onrender.com';

/* Client-side validation before submission */
document.getElementById('contact-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !email || !message) {
        alert('Please fill in all required fields (Name, Email, Message).');
        return;
    }
    if (!emailOk) {
        alert('Please enter a valid email address.');
        return;
    }

    // Submit to API
    try {
        const response = await fetch(`${API_BASE}/api/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, subject, message })
        });
        if (response.ok) {
            document.getElementById('success-banner').style.display = 'block';
            document.getElementById('contact-form').reset();
        } else {
            alert('Error sending message. Please try again.');
        }
    } catch (error) {
        alert('Error sending message. Please try again.');
    }
});