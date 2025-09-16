import db from "../database/config.js";
import { QueryTypes } from "sequelize";
import { v4 as uuidv4 } from 'uuid';

export const createCrime = async (req, res) => {
    try {
        const { 
            sr_no,
            case_no,
            crime_year,
            crime_section,
            crime_part,
            crime_type,
            crime_subtype,
            filing_date,
            crime_latitude,
            crime_longitude,
            crime_investigating_officer,
            crime_status,
            crime_outward_number,
            crime_chargesheet_date,
            crime_pending_reason,
            crime_investigation_done,
            crime_location,
            crime_property_value,
            crime_property_recovery,
            crime_reveal_date,
            crime_punishment_gt_7,
            crime_forensic_expert_visit,
            crime_e_sakshi_added,
            crime_forensic_expert_visit_date,
            crime_detention_period,
            crime_new_investigation_officer,
            crime_pending_duration,
            crime_investigation_reason,
            crime_complainant_address,
            crime_complainant_age,
            crime_complainant_name,
            crime_complainant_gender,
            crime_complainant_mobile_no,
            crime_occurrence_date
        } = req.body;

        const crime_id = uuidv4();

        const query = `
            INSERT INTO crimes (
                crime_id,
                sr_no,
                case_no,
                crime_year,
                crime_section,
                crime_part,
                crime_type,
                crime_subtype,
                filing_date,
                crime_latitude,
                crime_longitude,
                crime_investigating_officer,
                crime_status,
                crime_outward_number,
                crime_chargesheet_date,
                crime_pending_reason,
                crime_investigation_done,
                crime_location,
                crime_property_value,
                crime_property_recovery,
                crime_reveal_date,
                crime_punishment_gt_7,
                crime_forensic_expert_visit,
                crime_e_sakshi_added,
                crime_forensic_expert_visit_date,
                crime_detention_period,
                crime_new_investigation_officer,
                crime_pending_duration,
                crime_investigation_reason,
                crime_complainant_address,
                crime_complainant_age,
                crime_complainant_name,
                crime_complainant_gender,
                crime_complainant_mobile_no,
                crime_occurrence_date,
                created_at,
                created_by,
                updated_at,
                updated_by,
                is_active,
                is_deleted
            ) VALUES (${Array.from({length: 41}, (_, i) => `$${i + 1}`).join(', ')})
        `;

        const values = [
            crime_id,
            sr_no,
            case_no,
            crime_year,
            crime_section,
            crime_part,
            crime_type,
            crime_subtype,
            filing_date,
            crime_latitude,
            crime_longitude,
            crime_investigating_officer,
            crime_status || 'OPEN',
            crime_outward_number,
            crime_chargesheet_date,
            crime_pending_reason,
            crime_investigation_done,
            crime_location,
            crime_property_value,
            crime_property_recovery,
            crime_reveal_date,
            crime_punishment_gt_7,
            crime_forensic_expert_visit || false,
            crime_e_sakshi_added || false,
            crime_forensic_expert_visit_date,
            crime_detention_period,
            crime_new_investigation_officer,
            crime_pending_duration,
            crime_investigation_reason,
            crime_complainant_address,
            crime_complainant_age,
            crime_complainant_name,
            crime_complainant_gender,
            crime_complainant_mobile_no,
            crime_occurrence_date,
            new Date(),
            req.user.id || 'system',
            new Date(),
            req.user.id || 'system',
            true,
            false
        ];

        const [result] = await db.query(query, {
            bind: values,
            type: QueryTypes.INSERT
        });

        res.status(201).json({
            status: "success",
            message: "Crime record created successfully",
            data: {
                crime_id,
                ...req.body
            }
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
}

export const getCrimeById = async (req, res) => {
    try {
        const { crime_id } = req.body;

        const query = `
            SELECT 
                crime_id,
                sr_no,
                case_no,
                crime_year,
                crime_section,
                crime_part,
                crime_type,
                crime_subtype,
                filing_date,
                crime_latitude,
                crime_longitude,
                crime_investigating_officer,
                crime_status,
                crime_outward_number,
                crime_chargesheet_date,
                crime_pending_reason,
                crime_investigation_done,
                crime_location,
                crime_property_value,
                crime_property_recovery,
                crime_reveal_date,
                crime_punishment_gt_7,
                crime_forensic_expert_visit,
                crime_e_sakshi_added,
                crime_forensic_expert_visit_date,
                crime_detention_period,
                crime_new_investigation_officer,
                crime_pending_duration,
                crime_investigation_reason,
                crime_complainant_address,
                crime_complainant_age,
                crime_complainant_name,
                crime_complainant_gender,
                crime_complainant_mobile_no,
                crime_occurrence_date,
                created_at,
                updated_at
            FROM crimes
            WHERE crime_id = $1 AND is_deleted = false
            AND deleted_at IS NULL
        `;

        const [crime] = await db.query(query, {
            bind: [crime_id],
            type: QueryTypes.SELECT
        });

        if (!crime) {
            return res.status(404).json({
                status: "error",
                message: "Crime record not found"
            });
        }

        res.status(200).json({
            status: "success",
            data: crime
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const updateCrime = async (req, res) => {
    try {
        const { crime_id, updateData } = req.body;

        // Remove sensitive fields that shouldn't be updated directly
        delete updateData.crime_id;
        delete updateData.created_at;
        delete updateData.created_by;
        delete updateData.deleted_at;
        delete updateData.deleted_by;
        delete updateData.is_active;
        delete updateData.is_deleted;
        
        // Add audit fields
        updateData.updated_at = new Date();
        updateData.updated_by = req.user.id;

        const query = `
            UPDATE crimes 
            SET ${Object.keys(updateData).map((key, index) => `${key} = $${index + 2}`).join(', ')}
            WHERE crime_id = $1 AND is_deleted = false
            RETURNING *
        `;

        const values = [crime_id, ...Object.values(updateData)];
        
        const [updatedCrime] = await db.query(query, {
            bind: values,
            type: QueryTypes.SELECT
        });

        if (!updatedCrime) {
            return res.status(404).json({
                status: "error",
                message: "Crime record not found or already deleted"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Crime record updated successfully",
            data: updatedCrime
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const getAllCrimes = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        
        let query = `
            SELECT 
                crime_id,
                sr_no,
                case_no,
                crime_year,
                crime_section,
                crime_part,
                crime_type,
                crime_subtype,
                filing_date,
                crime_latitude,
                crime_longitude,
                crime_investigating_officer,
                crime_status,
                crime_outward_number,
                crime_chargesheet_date,
                crime_pending_reason,
                crime_investigation_done,
                crime_location,
                crime_property_value,
                crime_property_recovery,
                crime_reveal_date,
                crime_punishment_gt_7,
                crime_forensic_expert_visit,
                crime_e_sakshi_added,
                crime_forensic_expert_visit_date,
                crime_detention_period,
                crime_new_investigation_officer,
                crime_pending_duration,
                crime_investigation_reason,
                crime_complainant_address,
                crime_complainant_age,
                crime_complainant_name,
                crime_complainant_gender,
                crime_complainant_mobile_no,
                crime_occurrence_date,
                created_at,
                updated_at
            FROM crimes
            WHERE is_deleted = false
        `;

        // Get total count for pagination
        const [countResult] = await db.query(
            `SELECT COUNT(*) as total FROM (${query}) as subquery`,
            {
                type: QueryTypes.SELECT
            }
        );

        const total = parseInt(countResult.total);

        // Add pagination
        const offset = (page - 1) * limit;
        query += ` ORDER BY created_at DESC LIMIT $1 OFFSET $2`;

        const crimes = await db.query(query, {
            bind: [limit, offset],
            type: QueryTypes.SELECT
        });

        res.status(200).json({
            status: "success",
            data: {
                crimes,
                pagination: {
                    total,
                    page: parseInt(page),
                    pages: Math.ceil(total / limit),
                    limit: parseInt(limit)
                }
            }
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const deleteCrime = async (req, res) => {
    try {
        const { crime_id } = req.body;

        // Soft delete by updating deleted_at and audit fields
        const query = `
            UPDATE crimes 
            SET 
                is_active = false,
                is_deleted = true,
                deleted_at = $2,
                deleted_by = $3,
                updated_at = $2,
                updated_by = $3
            WHERE crime_id = $1 
            AND is_deleted = false
            RETURNING *
        `;

        const values = [
            crime_id,
            new Date(),
            req.user.id || 'system'
        ];

        const [deletedCrime] = await db.query(query, {
            bind: values,
            type: QueryTypes.SELECT
        });

        if (!deletedCrime) {
            return res.status(404).json({
                status: "error",
                message: "Crime not found or already deleted"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Crime deleted successfully",
            data: deletedCrime
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};
