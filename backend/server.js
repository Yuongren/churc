require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const { sequelize, connectDB } = require("./config/db");

const app = express();

const cloudinaryRoutes = require("./routes/cloudinary");

const mediaRoutes = require("./routes/mediaRoutes");

// =========================
// MIDDLEWARE
// =========================
const allowedOrigins = [
    'https://jcccityatlar.netlify.app',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5500'
];

app.use(cors({
    origin: [
        'https://jcccityatlar.netlify.app',
        'http://localhost:5500'
    ]
}));

app.use(express.json());
app.use(express.urlencoded({ limit: "500mb", extended: true }));

// =========================
// STATIC FILES
// =========================
app.use(express.static(path.join(__dirname, "../frontend")));

// Ensure uploads folder exists
const uploadPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}

app.use("/uploads", express.static(uploadPath));

// =========================
// ROUTES
// =========================
app.use("/api/contact", require("./routes/contact"));
app.use("/api/services", require("./routes/services"));
app.use("/api/media", require("./routes/media"));

app.use("/api/media", mediaRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("API running...");
});

// =========================
// START SERVER
// =========================
const startServer = async () => {
    try {
        await connectDB();

        await sequelize.sync({ alter: true });

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log("✅ Database connected successfully");
        });

    } catch (err) {
        console.error("❌ Failed to start server:", err);
        process.exit(1);
    }
};

startServer();