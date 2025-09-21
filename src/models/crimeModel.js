import { DataTypes } from "sequelize";
import sequelize from "../database/config.js";

const Crime = sequelize.define("crimes", {
    crime_id: {
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
    case_no: {
        type: DataTypes.STRING(255)
    },
    crime_year: {
        type: DataTypes.INTEGER
    },
    crime_section: {
        type: DataTypes.TEXT
    },
    crime_part: {
        type: DataTypes.TEXT
    },
    crime_type: {
        type: DataTypes.TEXT
    },
    crime_subtype: {
        type: DataTypes.TEXT
    },
    filing_date: {
        type: DataTypes.DATE
    },
    crime_latitude: {
        type: DataTypes.STRING(50)
    },
    crime_longitude: {
        type: DataTypes.STRING(50)
    },
    crime_investigating_officer: {
        type: DataTypes.STRING(255)
    },
    crime_status: {
        type: DataTypes.STRING(100)
    },
    crime_outward_number: {
        type: DataTypes.STRING(100)
    },
    crime_chargesheet_date: {
        type: DataTypes.DATE
    },
    crime_pending_reason: {
        type: DataTypes.TEXT
    },
    crime_investigation_done: {
        type: DataTypes.TEXT
    },
    crime_location: {
        type: DataTypes.TEXT
    },
    crime_property_value: {
        type: DataTypes.STRING(100)
    },
    crime_property_recovery: {
        type: DataTypes.STRING(100)
    },
    crime_reveal_date: {
        type: DataTypes.DATE
    },
    crime_punishment_gt_7: {
        type: DataTypes.STRING(50)
    },
    crime_forensic_expert_visit: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    crime_e_sakshi_added: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    crime_forensic_expert_visit_date: {
        type: DataTypes.DATE
    },
    crime_detention_period: {
        type: DataTypes.STRING(50),
    },
    crime_new_investigation_officer: {
        type: DataTypes.STRING(255)
    },
    crime_pending_duration: {
        type: DataTypes.STRING(100)
    },
    crime_investigation_reason: {
        type: DataTypes.TEXT
    },
    crime_complainant_address: {
        type: DataTypes.TEXT
    },
    crime_complainant_age: {
        type: DataTypes.INTEGER
    },
    crime_complainant_name: {
        type: DataTypes.STRING(255)
    },
    crime_complainant_gender: {
        type: DataTypes.STRING(50)
    },
    crime_complainant_mobile_no: {
        type: DataTypes.STRING(20)
    },
    crime_occurrence_date: {
        type: DataTypes.DATE
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
    tableName: "crimes",
    timestamps: false,
});

export default Crime;