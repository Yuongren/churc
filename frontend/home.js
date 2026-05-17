// const window.API_BASE = "https://churc.onrender.com";

// =========================
// THEME TOGGLE
// =========================
document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("theme-toggle");

    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            document.body.classList.toggle("light-mode");

            const mode = document.body.classList.contains("light-mode") ? "light" : "dark";
            localStorage.setItem("theme", mode);
            toggleBtn.innerText = mode === "light" ? "☀️" : "🌙";
        });

        const saved = localStorage.getItem("theme");
        if (saved === "light") {
            document.body.classList.add("light-mode");
            toggleBtn.innerText = "☀️";
        }
    }

    loadHomeMedia();
});

// =========================
// LOAD HOME MEDIA
// =========================
async function loadHomeMedia() {
    const gallery = document.getElementById("home-media-gallery");

    if (!gallery) return;

    gallery.innerHTML = `<div class="empty-media">Loading media...</div>`;

    try {
        const response = await fetch(`${window.API_BASE}/api/media/section/home`);
        if (!response.ok) throw new Error("Could not load home media");

        const items = await response.json();

        if (!items || items.length === 0) {
            gallery.innerHTML = `<div class="empty-media">No home media uploaded yet.</div>`;
            return;
        }

        gallery.innerHTML = items.map(item => `
            <div class="media-item">
                ${
                    item.type === "image"
                        ? `<img data-src="${item.filepath}" class="media-preview" alt="${item.title || ''}" class="media-preview">`
                        : `<iframe
                                class="media-preview"
                                src="${convertToEmbedUrl(item.filepath)}"
                                frameborder="0"
                                allowfullscreen>
                            </iframe>`
                }

                <div class="media-info">
                    <div class="media-title">${item.title || "Untitled"}</div>

                    <div class="media-meta">
                        ${item.type.toUpperCase()}
                        ${item.uploadedAt ? " • " + new Date(item.uploadedAt).toLocaleDateString() : ""}
                    </div>

                    ${item.description ? `<div class="media-description">${item.description}</div>` : ""}
                </div>
            </div>
        `).join("");

    } catch (error) {
        gallery.innerHTML = `<div class="empty-media">Error: ${error.message}</div>`;
    }
    createMediaObserver(); 
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

function convertToEmbedUrl(url) {

    if (url.includes("youtu.be")) {
        const id = url.split("/").pop();
        return `https://www.youtube.com/embed/${id}`;
    }

    if (url.includes("youtube.com/watch?v=")) {
        const id = url.split("v=")[1].split("&")[0];
        return `https://www.youtube.com/embed/${id}`;
    }

    return url;
}