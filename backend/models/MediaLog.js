// Add Upload History Table

const MediaLog = sequelize.define("MediaLog", {

    action: DataTypes.STRING,

    mediaId: DataTypes.INTEGER,

    adminEmail: DataTypes.STRING
});

await MediaLog.create({
    action: "DELETE",
    mediaId: media.id,
    adminEmail: req.user.email
});