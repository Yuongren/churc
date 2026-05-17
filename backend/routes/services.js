const express = require("express");
const router = express.Router();
const Service = require("../models/Service");

// GET all services
router.get("/", async (req, res) => {
    try {
        const services = await Service.findAll();
        res.json(services);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// POST new service (for admin use)
router.post("/", async (req, res) => {
    try {
        const service = await Service.create(req.body);
        res.json(service);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

module.exports = router;