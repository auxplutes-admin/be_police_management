import { DataTypes } from "sequelize";
import sequelize from "../database/config.js";

const PoliceOfficer = sequelize.define("police_officers", {
    officer_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    station_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    officer_name: {
        type: DataTypes.STRING(255)
    },
    officer_designation: {
        type: DataTypes.STRING(100)
    },
    officer_badge_number: {
        type: DataTypes.STRING(50)
    },
    officer_mobile_number: {
        type: DataTypes.STRING(20)
    },
    officer_username: {
        type: DataTypes.STRING(255)
    },
    officer_email: {
        type: DataTypes.STRING(255)
    },
    officer_password: {
        type: DataTypes.STRING(255)
    },
    officer_joining_date: {
        type: DataTypes.DATE
    },
    officer_status: {
        type: DataTypes.STRING(50)
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    created_by: {
        type: DataTypes.UUID,
    },
    updated_by: {
        type: DataTypes.UUID,
    },
    deleted_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    deleted_by: {
        type: DataTypes.UUID,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: "police_officers",
    timestamps: false,
});

export default PoliceOfficer;
