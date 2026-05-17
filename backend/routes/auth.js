const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

router.post("/login", async (req, res) => {

    const { email, password } = req.body;

    if (email !== ADMIN_EMAIL) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

    if (!valid) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
        { email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.json({ token });
});

module.exports = router;