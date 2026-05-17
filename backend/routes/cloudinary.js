const express = require("express");
const router = express.Router();
const cloudinary = require("../config/cloudinary");

router.get("/signature", (req, res) => {
    const timestamp = Math.floor(Date.now() / 1000);

    const signature = cloudinary.utils.api_sign_request(
        { timestamp },
        process.env.CLOUDINARY_API_SECRET
    );

    res.json({
        timestamp,
        signature,
        api_key: process.env.CLOUDINARY_API_KEY,
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME
    });
});

module.exports = router;