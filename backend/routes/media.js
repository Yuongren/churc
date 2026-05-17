const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const Media = require("../models/Media");
const auth = require("../middleware/auth");

// =========================
// CLOUDINARY STORAGE
// =========================
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "church-media",
        resource_type: "auto", // supports image + video
        public_id: (req, file) => {
            return Date.now() + "-" + file.originalname;
        }
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 500 * 1024 * 1024 } // 500MB
});

// =========================
// GET SINGLE MEDIA
// =========================
router.get("/:id", async (req, res) => {
    try {
        const media = await Media.findByPk(req.params.id);
        if (!media) return res.status(404).json({ error: "Media not found" });
        res.json(media);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// =========================
// GET BY SECTION
// =========================
router.get("/section/:section", async (req, res) => {
    try {
        const media = await Media.findAll({
            where: { section: req.params.section },
            order: [["uploadedAt", "DESC"]]
        });
        res.json(media);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// =========================
// UPLOAD
// =========================
router.post("/upload-meta", async (req, res) => {
    try {
        const {
            type,
            section,
            title,
            description,
            filepath,
            public_id
        } = req.body;

        if (!type || !section || !filepath) {
            return res.status(400).json({
                error: "Missing required fields"
            });
        }

        const media = await Media.create({
            filename: title || "media",
            filepath,
            public_id: public_id || null,
            type,
            section,
            title,
            description
        });

        res.json({
            success: true,
            media
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: err.message
        });
    }
});
// =========================
// UPDATE
// =========================
router.put("/:id", async (req, res) => {
    res.json({ success: true });
});

// =========================
// DELETE
// =========================
router.delete("/:id", async (req, res) => {
    try {
        const media = await Media.findByPk(req.params.id);
        if (!media) {
            return res.status(404).json({ error: "Media not found" });
        }

        // 🔥 DELETE FROM CLOUDINARY
        if (media.public_id) {
            await cloudinary.uploader.destroy(
                media.public_id,
                {
                    resource_type: media.type === "video" ? "video" : "image"
                });
        }

        await media.destroy();

        res.json({ success: true });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;