const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Service = sequelize.define("Service", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    time: {
        type: DataTypes.STRING,
        allowNull: false
    },
    day: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Service;