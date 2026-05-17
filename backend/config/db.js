const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: false
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ PostgreSQL Connected");
    } catch (err) {
        console.error("❌ DB Error:", err);
    }
};

module.exports = { sequelize, connectDB };