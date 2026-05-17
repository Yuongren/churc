const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Media = sequelize.define("Media", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    public_id: {
        type: DataTypes.STRING,
        allowNull: true
    },

    filename: {
        type: DataTypes.STRING,
        allowNull: true
    },

    filepath: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    
    type: {
        type: DataTypes.ENUM("image", "video"),
        allowNull: false
    },

    section: {
        type: DataTypes.ENUM("home", "services"),
        allowNull: false
    },

    title: {
        type: DataTypes.STRING,
        allowNull: true
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    views:{
    type:DataTypes.INTEGER,
    defaultValue:0
    },

    clicks:{
        type:DataTypes.INTEGER,
        defaultValue:0
    },

    uploadedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },    

});

module.exports = Media;