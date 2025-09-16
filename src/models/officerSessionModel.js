import { DataTypes } from "sequelize";
import sequelize from "../database/config.js";

const OfficerSession = sequelize.define("officer_sessions", {
    session_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    officer_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ip_address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    device_info: {
        type: DataTypes.JSON,
        allowNull: true
    },
    location: {
        type: DataTypes.JSON,
        allowNull: true
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false
    },
    login_time: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    last_active_time: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    logout_time: {
        type: DataTypes.DATE,
        allowNull: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
}, {
    tableName: "officer_sessions",
    timestamps: false,
});

export default OfficerSession;