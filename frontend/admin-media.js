// =========================
// CONFIG
// =========================
// const window.API_BASE = "https://churc.onrender.com";

// =========================
// INITIAL LOAD
// =========================
document.addEventListener('DOMContentLoaded', () => {

    loadMediaGallery('home');

    setupMediaTypeToggle('home');
    setupMediaTypeToggle('services');

});

// =========================
// EDIT MEDIA MODAL FUNCTIONS
// =========================

// Global variables for editing
// let currentEditingMediaId = null;
// let currentEditingSection = null;

// Save edited media
async function saveMediaEdits(event) {
    if (event) {
        event.preventDefault();
    }
    
    if (!currentEditingMediaId || !currentEditingSection) {
        showToast('No media is being edited', 'error');
        return;
    }
    
    const updatedData = {
        title: document.getElementById('edit-media-title').value,
        description: document.getElementById('edit-media-description').value
    };
    
    try {
        const response = await fetch(`${window.API_BASE}/api/media/${currentEditingMediaId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });
        
        if (response.ok) {
            showToast('Media updated successfully!', 'success');

            // store section BEFORE modal resets it
            const section = currentEditingSection;

            closeEditMediaModal();

            // Refresh gallery
            loadMediaGallery(section);
        } else {
            throw new Error('Failed to update media');
        }
    } catch (error) {
        console.error('Error saving media:', error);
        showToast('Failed to update media: ' + error.message, 'error');
    }
}

// Close the edit modal - THIS IS THE MISSING FUNCTION
function closeEditMediaModal() {
    const modal = document.getElementById('edit-media-modal');
    if (modal) {
        modal.classList.remove('show');
        modal.classList.remove('active'); // Remove both just in case
    }
    
    // Clear the form
    const titleInput = document.getElementById('edit-media-title');
    const descInput = document.getElementById('edit-media-description');
    if (titleInput) titleInput.value = '';
    if (descInput) descInput.value = '';
    
    // Reset tracking variables
    currentEditingMediaId = null;
    currentEditingSection = null;
}

// Also need to fix your viewMedia and closeMediaModal functions
// Update your existing closeMediaModal function to use 'show' instead of 'active':

// Replace your existing closeMediaModal function with this:
function closeMediaModal() {
    const modal = document.getElementById("media-modal");
    const video = document.getElementById("media-preview-video");
    const img = document.getElementById("media-preview-img");
    
    if (modal) {
        modal.classList.remove("active");
        modal.classList.remove("show");
    }
    
    if (video) video.src = "";
    if (img) img.src = "";
}

// Update your viewMedia function to use 'show' consistently:
// Replace your existing viewMedia function with this:
function viewMedia(url, type) {
    const modal = document.getElementById("media-modal");
    const img = document.getElementById("media-preview-img");
    const video = document.getElementById("media-preview-video");
    
    if (!modal) return;
    
    img.style.display = "none";
    video.style.display = "none";
    
    if (type === "image") {
        img.src = url;
        img.style.display = "block";
    } else {
        video.src = convertToEmbedUrl(url);
        video.style.display = "block";
    }
    
    // Use 'show' for consistency with your CSS
    modal.classList.add("show");
}

// =========================
// ADD EVENT LISTENERS
// =========================
document.addEventListener('DOMContentLoaded', () => {
    // Add submit event to edit form
    const editForm = document.getElementById('edit-media-form');
    if (editForm) {
        editForm.addEventListener('submit', saveMediaEdits);
    }
    
    // Close modal when clicking outside
    const editModal = document.getElementById('edit-media-modal');
    if (editModal) {
        editModal.addEventListener('click', (e) => {
            if (e.target === editModal) {
                closeEditMediaModal();
            }
        });
    }
    
    // Also fix the media modal close on outside click
    const mediaModal = document.getElementById('media-modal');
    if (mediaModal) {
        mediaModal.addEventListener('click', (e) => {
            if (e.target === mediaModal) {
                closeMediaModal();
            }
        });
    }
});

// Edit media function
async function editMedia(mediaId, section) {
    currentEditingMediaId = mediaId;
    currentEditingSection = section;
    
    try {
        // Fetch the media details
        const response = await fetch(`${window.API_BASE}/api/media/${mediaId}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch media details');
        }
        
        const media = await response.json();
        
        // Populate the edit modal
        const titleInput = document.getElementById('edit-media-title');
        const descInput = document.getElementById('edit-media-description');
        
        if (titleInput) titleInput.value = media.title || '';
        if (descInput) descInput.value = media.description || '';
        
        // Show the modal - use 'show' for consistency
        const modal = document.getElementById('edit-media-modal');
        if (modal) {
            modal.classList.add('show');
        }
        
    } catch (error) {
        console.error('Error fetching media:', error);
        showToast('Failed to load media details: ' + error.message, 'error');
    }
}

// =========================
// UPLOAD MEDIA
// =========================
async function uploadMedia(section) {

    const type =
        document.getElementById(`${section}-media-type`).value;

    const title =
        document.getElementById(`${section}-media-title`).value;

    const description =
        document.getElementById(`${section}-media-description`).value;

    try {

        let filepath = "";
        let public_id = null;

        // ======================
        // IMAGE UPLOAD
        // ======================
        if (type === "image") {

            const file =
                document.getElementById(`${section}-media-file`).files[0];

            if (!file) {
                return alert("Select an image");
            }

            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "church_unsigned");

            const cloudRes = await fetch(
                "https://api.cloudinary.com/v1_1/de2psult9/image/upload",
                {
                    method: "POST",
                    body: formData
                }
            );

            const cloudData = await cloudRes.json();

            filepath = cloudData.secure_url;
            public_id = cloudData.public_id;
        }

        // ======================
        // VIDEO LINK
        // ======================
        else {


            filepath =
                document.getElementById(`${section}-video-url`).value;

            if (!filepath) {
                return alert("Enter video URL");
            }

            const valid =
                filepath.includes("youtube.com") ||
                filepath.includes("youtu.be") ||
                filepath.includes("vimeo.com");

            if (!valid) {
                return alert("Only YouTube or Vimeo links allowed");
            }
        }

        // ======================
        // SAVE TO DATABASE
        // ======================
        const response = await fetch(`${window.API_BASE}/api/media/upload-meta`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                type,
                section,
                title,
                description,
                filepath,
                public_id
            })
        });

        if (!response.ok) {
            throw new Error("Upload failed");
        }

        showToast("Upload successful")
        document.getElementById(`${section}-media-title`).value = "";
        document.getElementById(`${section}-media-description`).value = "";
        document.getElementById(`${section}-video-url`).value = "";
        document.getElementById(`${section}-media-file`).value = "";

        loadMediaGallery(section);

    } catch (error) {

        console.error(error);

        showToast(error.message, "error");
    }
}

// =========================
// LOAD MEDIA
// =========================
async function loadMediaGallery(section) {

    const gallery =
        document.getElementById(`${section}-media-gallery`);

    if (!gallery) {
        console.error(`Gallery not found for section: ${section}`);
        return;
    }

    gallery.innerHTML = "Loading...";
    try {

        const response =
            await fetch(`${window.API_BASE}/api/media/section/${section}`);

        const items = await response.json();

        if (!items.length) {
            gallery.innerHTML = "No media uploaded";
            return;
        }

        gallery.innerHTML = items.map(media => `

            <div class="media-item">

                ${
                    media.type === "image"

                    ? `<img src="${media.filepath}" class="media-preview" onclick="viewMedia('${media.filepath}','image')">`

                    : `<div class="video-card"
                        onclick="viewMedia('${media.filepath}','video')">

                        <img
                            src="${getYoutubeThumbnail(media.filepath)}"
                            class="video-thumbnail"
                        >

                        <div class="play-overlay">▶</div>

                    </div>`
                    }

                <div class="media-info">

                    <div class="media-title">
                        ${escapeHtml(media.title || "")}
                    </div>
                    
                    <div class="media-description">
                        ${escapeHtml(media.description || "")}
                    </div>

                    <div class="media-actions">

                        <!-- ✅ ADD EDIT BUTTON HERE -->
                        <button class="btn-edit" onclick="editMedia(${media.id}, '${section}')">
                            ✏️ Edit
                        </button>

                        <button class="btn-delete" onclick="deleteMedia(${media.id}, '${section}')">
                            🗑️ Delete
                        </button>

                    </div>

                </div>

            </div>

        `).join("");

    } catch (error) {

        console.error(error);

        gallery.innerHTML = "Failed loading media";
    }
}

// Helper function to escape HTML
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// =========================
// CONVERT YOUTUBE URL
// =========================
function convertToEmbedUrl(url) {

    // YouTube short link
    if (url.includes("youtu.be")) {
        const id = url.split("/").pop();
        return `https://www.youtube.com/embed/${id}`;
    }

    // YouTube watch link
    if (url.includes("youtube.com/watch?v=")) {
        const id = url.split("v=")[1].split("&")[0];
        return `https://www.youtube.com/embed/${id}`;
    }

    return url;
}


function createMediaObserver() {
    const images = document.querySelectorAll("img[data-src]");

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;

                img.src = img.dataset.src;

                img.onload = () => {
                    img.removeAttribute("data-src");
                };

                obs.unobserve(img);
            }
        });
    });

    images.forEach(img => observer.observe(img));
}

// =========================
// TOGGLE IMAGE / VIDEO INPUTS
// =========================
function setupMediaTypeToggle(section) {
    const typeSelect = document.getElementById(`${section}-media-type`);

    const imageWrapper = document.getElementById(`${section}-image-wrapper`);
    const videoWrapper = document.getElementById(`${section}-video-wrapper`);

    if (!typeSelect || !imageWrapper || !videoWrapper) return;

    function toggleFields() {
        if (typeSelect.value === "video") {
            imageWrapper.style.display = "none";
            videoWrapper.style.display = "block";
        } else {
            imageWrapper.style.display = "block";
            videoWrapper.style.display = "none";
        }
    }

    // run immediately
    toggleFields();

    // run on change
    typeSelect.addEventListener("change", toggleFields);
}

// Auto YouTube Thumbnails
function getYoutubeThumbnail(url) {

    let id = "";

    if (url.includes("youtu.be")) {
        id = url.split("/").pop();
    }
    else if (url.includes("watch?v=")) {
        id = url.split("v=")[1].split("&")[0];
    }

    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

// ADD TOAST NOTIFICATIONS
function showToast(message, type = "success") {

    const toast = document.createElement("div");

    toast.className = `toast ${type}`;

    toast.textContent = message;

    document.getElementById("toast-container")
        .appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// 

async function toggleFeatured(id){

    try{

        const response = await fetch(
            `${window.API_BASE}/api/media/feature/${id}`,
            {
                method:"PUT"
            }
        );

        if(!response.ok){
            throw new Error("Feature update failed");
        }

        showToast("Featured media updated");

        loadMediaGallery("home");
        loadMediaGallery("services");

    }catch(error){

        showToast(error.message,"error");
    }
}


// deleteMedia() Function


async function deleteMedia(id, section) {

    if (!confirm("Delete this media?")) return;

    try {

        const response = await fetch(`${window.API_BASE}/api/media/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Delete failed");
        }

        showToast("Media deleted");

        loadMediaGallery(section);

    } catch (error) {

        console.error(error);

        showToast(error.message, "error");
    }
}

// View media

function viewMedia(url, type) {

    const modal = document.getElementById("media-modal");

    const img = document.getElementById("media-preview-img");

    const video = document.getElementById("media-preview-video");

    img.style.display = "none";
    video.style.display = "none";

    if (type === "image") {

        img.src = url;
        img.style.display = "block";

    } else {

        video.src = convertToEmbedUrl(url);
        video.style.display = "block";
    }

    modal.classList.add("active");
}

// closeMediaModal

function closeMediaModal() {

    const modal = document.getElementById("media-modal");

    const video = document.getElementById("media-preview-video");

    modal.classList.remove("active");

    video.src = "";
}