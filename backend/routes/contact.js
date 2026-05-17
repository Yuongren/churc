const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// GET: Fetch all contacts (admin only)
router.get("/", async (req, res) => {
    try {
        const contacts = await Contact.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(contacts);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// POST: Submit form
router.post("/", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        await Contact.create({ name, email, subject, message });

        res.json({ msg: "Message saved successfully" });
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// DELETE: Delete a contact message
router.delete("/:id", async (req, res) => {
    try {
        await Contact.destroy({ where: { id: req.params.id } });
        res.json({ msg: "Message deleted successfully" });
    } catch (err) {
        res.status(500).send("Server error");
    }
});

module.exports = router;