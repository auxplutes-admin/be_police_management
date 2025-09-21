import { DataTypes } from "sequelize";
import sequelize from "../database/config.js";

const Application = sequelize.define("applications", {
    application_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    station_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    sr_no: {
        type: DataTypes.INTEGER
    },
    application_no: {
        type: DataTypes.INTEGER
    },
    inward_no: {
        type: DataTypes.INTEGER
    },
    received_from: {
        type: DataTypes.STRING(255)
    },
    source_outward_no: {
        type: DataTypes.STRING(255)
    },
    police_station_inward_no: {
        type: DataTypes.INTEGER
    },
    received_date: {
        type: DataTypes.DATE
    },
    year: {
        type: DataTypes.INTEGER
    },
    applicant_name: {
        type: DataTypes.STRING(255)
    },
    applicant_address: {
        type: DataTypes.TEXT
    },
    applicant_mobile: {
        type: DataTypes.STRING(20)
    },
    respondent_name: {
        type: DataTypes.STRING(255)
    },
    respondent_mobile: {
        type: DataTypes.STRING(20)
    },
    respondent_address: {
        type: DataTypes.TEXT
    },
    application_type: {
        type: DataTypes.STRING(100)
    },
    brief_matter: {
        type: DataTypes.TEXT
    },
    investigation_officer: {
        type: DataTypes.STRING(255)
    },
    previous_officer: {
        type: DataTypes.STRING(255)
    },
    current_status: {
        type: DataTypes.STRING(100)
    },
    action_taken: {
        type: DataTypes.TEXT
    },
    outward_date: {
        type: DataTypes.DATE
    },
    application_classification: {
        type: DataTypes.STRING(100)
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
    tableName: "applications",
    timestamps: false,
});

export default Application;