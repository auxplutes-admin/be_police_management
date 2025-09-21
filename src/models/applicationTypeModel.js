import { DataTypes } from "sequelize";
import sequelize from "../database/config.js";

const ApplicationType = sequelize.define("application_types", {
    application_type_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    station_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    application_type_name: {
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
    tableName: "application_types",
    timestamps: false,
});

export default ApplicationType;
