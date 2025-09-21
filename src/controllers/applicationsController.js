import db from "../database/config.js";
import { QueryTypes } from "sequelize";
import { v4 as uuidv4 } from 'uuid';

export const createApplication = async (req, res) => {
    try {
        const {
            sr_no,
            station_id,
            application_no,
            inward_no,
            received_from,
            source_outward_no,
            police_station_inward_no,
            received_date,
            year,
            applicant_name,
            applicant_address,
            applicant_mobile,
            respondent_name,
            respondent_mobile,
            respondent_address,
            application_type,
            brief_matter,
            investigation_officer,
            previous_officer,
            current_status,
            action_taken,
            outward_date,
            application_classification
        } = req.body;

        const application_id = uuidv4();

        const query = `
            INSERT INTO applications (
                application_id,
                sr_no,
                station_id,
                application_no,
                inward_no,
                received_from,
                source_outward_no,
                police_station_inward_no,
                received_date,
                year,
                applicant_name,
                applicant_address,
                applicant_mobile,
                respondent_name,
                respondent_mobile,
                respondent_address,
                application_type,
                brief_matter,
                investigation_officer,
                previous_officer,
                current_status,
                action_taken,
                outward_date,
                application_classification,
                created_at,
                created_by,
                updated_at,
                updated_by,
                is_active,
                is_deleted,
                deleted_at
            ) VALUES (${Array.from({length: 31}, (_, i) => `$${i + 1}`).join(', ')})
        `;

        const values = [
            application_id,
            sr_no,
            station_id,
            application_no,
            inward_no,
            received_from,
            source_outward_no,
            police_station_inward_no,
            received_date,
            year,
            applicant_name,
            applicant_address,
            applicant_mobile,
            respondent_name,
            respondent_mobile,
            respondent_address,
            application_type,
            brief_matter,
            investigation_officer,
            previous_officer,
            current_status || 'PENDING',
            action_taken,
            outward_date,
            application_classification,
            new Date(),
            req.user.id || 'system',
            new Date(),
            req.user.id || 'system',
            true,
            false,
            null
        ];

        const [result] = await db.query(query, {
            bind: values,
            type: QueryTypes.INSERT
        });

        res.status(201).json({
            status: "success",
            message: "Application created successfully",
            data: {
                application_id,
                ...req.body
            }
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const getApplicationById = async (req, res) => {
    try {
        const { application_id } = req.body;

        const query = `
            SELECT 
               *
            FROM applications
            WHERE application_id = $1 AND is_deleted = false
            AND deleted_at IS NULL
        `;

        const [application] = await db.query(query, {
            bind: [application_id],
            type: QueryTypes.SELECT
        });

        if (!application) {
            return res.status(404).json({
                status: "error",
                message: "Application not found"
            });
        }

        res.status(200).json({
            status: "success",
            data: application
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const updateApplication = async (req, res) => {
    try {
        const { application_id, updateData } = req.body;

        // Remove sensitive fields that shouldn't be updated directly
        delete updateData.application_id;
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
            UPDATE applications 
            SET ${Object.keys(updateData).map((key, index) => `${key} = $${index + 3}`).join(', ')}
            WHERE application_id = $1 AND is_deleted = false
            RETURNING *
        `;

        const values = [application_id, ...Object.values(updateData)];
        
        const [updatedApplication] = await db.query(query, {
            bind: values,
            type: QueryTypes.SELECT
        });

        if (!updatedApplication) {
            return res.status(404).json({
                status: "error",
                message: "Application not found or already deleted"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Application updated successfully",
            data: updatedApplication
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const getAllApplications = async (req, res) => {
    try {
        const { station_id, page = 1, limit = 10 } = req.body;
        
        
        let query = `
            SELECT 
                *
            FROM applications
            WHERE is_deleted = false
            AND station_id = $1
        `;

        // Get total count for pagination
        const [countResult] = await db.query(
            `SELECT COUNT(*) as total FROM (${query}) as subquery WHERE is_deleted = false AND station_id = $1`,
            {
                bind: [station_id],
                type: QueryTypes.SELECT
            }
        );

        const total = parseInt(countResult.total);

        let applications;
        
        if (page && limit) {
            // Add pagination if requested
            const offset = (page - 1) * limit;
            query += ` ORDER BY created_at DESC LIMIT $2 OFFSET $3`;

            applications = await db.query(query, {
                bind: [station_id, limit, offset],
                type: QueryTypes.SELECT
            });
        } else {
            // Return all results if no pagination
            query += ` ORDER BY created_at DESC`;
            
            applications = await db.query(query, {
                bind: [station_id],
                type: QueryTypes.SELECT
            });
        }

        const response = {
            status: "success",
            data: {
                applications
            }
        };

        if (page && limit) {
            response.data.pagination = {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit),
                limit: parseInt(limit)
            };
        }

        res.status(200).json(response);

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const deleteApplication = async (req, res) => {
    try {
        const { application_id } = req.body;

        // Soft delete by updating deleted_at and audit fields
        const query = `
            UPDATE applications 
            SET 
                is_active = false,
                is_deleted = true,
                deleted_at = $2,
                deleted_by = $3,
                updated_at = $2,
                updated_by = $3
            WHERE application_id = $1 
            AND is_deleted = false
            RETURNING *
        `;

        const values = [
            application_id,
            new Date(),
            req.user.id || 'system'
        ];

        const [deletedApplication] = await db.query(query, {
            bind: values,
            type: QueryTypes.SELECT
        });

        if (!deletedApplication) {
            return res.status(404).json({
                status: "error",
                message: "Application not found or already deleted"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Application deleted successfully",
            data: deletedApplication
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};


// Graphs 
export const getApplicationsByType = async (req, res) => {
    try {
        const { station_id } = req.body;

        if (!station_id) {
            return res.status(400).json({
                status: "error", 
                message: "Station ID is required"
            });
        }

        const query = `
            SELECT 
                COALESCE(a.application_type, 'Unknown') as application_type_name,
                COUNT(a.application_id) as application_count
            FROM applications a
            WHERE a.station_id = $1
            AND a.is_deleted = false
            GROUP BY a.application_type
        `;

        const applications = await db.query(query, {
            bind: [station_id],
            type: QueryTypes.SELECT
        });

        res.status(200).json({
            status: "success",
            data: applications
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};
