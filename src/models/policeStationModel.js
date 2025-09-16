import { DataTypes } from "sequelize";
import sequelize from "../database/config.js";

const PoliceStation = sequelize.define("police_stations", {
    station_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    station_name: {
        type: DataTypes.STRING(255)
    },
    station_code: {
        type: DataTypes.STRING(50)
    },
    station_phone: {
        type: DataTypes.STRING(20)
    },
    station_email: {
        type: DataTypes.STRING(255)
    },
    station_latitude: {
        type: DataTypes.STRING(50)
    },
    station_longitude: {
        type: DataTypes.STRING(50)
    },
    station_zone: {
        type: DataTypes.STRING(50)
    },
    station_address: {
        type: DataTypes.TEXT
    },
    station_city: {
        type: DataTypes.STRING(50)
    },
    station_state: {
        type: DataTypes.STRING(50)
    },
    station_jurisdiction: {
        type: DataTypes.TEXT
    },
    station_type: {
        type: DataTypes.STRING(100)
    },
    station_incharge: {
        type: DataTypes.STRING(255)
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
    tableName: "police_stations",
    timestamps: false,
});

export default PoliceStation;
