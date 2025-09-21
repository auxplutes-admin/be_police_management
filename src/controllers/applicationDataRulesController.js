import db from "../database/config.js";
import { QueryTypes } from "sequelize";
import { v4 as uuidv4 } from 'uuid';

export const createApplicationType = async (req, res) => {
    try {
        const { application_type_name, station_id } = req.body;

        const application_type_id = uuidv4();

        const query = `
            INSERT INTO application_types (
                application_type_id,
                application_type_name,
                station_id,
                created_at,
                created_by,
                updated_at,
                updated_by,
                is_active,
                is_deleted
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `;

        const values = [
            application_type_id,
            application_type_name,
            station_id,
            new Date(),
            req.user.id || 'system',
            new Date(),
            req.user.id || 'system',
            true,
            false
        ];

        await db.query(query, {
            bind: values,
            type: QueryTypes.INSERT
        });

        res.status(201).json({
            status: "success",
            message: "Application type created successfully",
            data: {
                application_type_id,
                application_type_name
            }
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const getApplicationTypeById = async (req, res) => {
    try {
        const { application_type_id, station_id } = req.body;

        const query = `
            SELECT 
                application_type_id,
                application_type_name,
                station_id,
                created_at,
                updated_at
            FROM application_types
            WHERE application_type_id = $1 
            AND station_id = $2
            AND is_deleted = false
            AND deleted_at IS NULL
        `;

        const [applicationType] = await db.query(query, {
            bind: [application_type_id, station_id],
            type: QueryTypes.SELECT
        });

        if (!applicationType) {
            return res.status(404).json({
                status: "error",
                message: "Application type not found"
            });
        }

        res.status(200).json({
            status: "success",
            data: applicationType
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const updateApplicationType = async (req, res) => {
    try {
        const { application_type_id, application_type_name, station_id } = req.body;

        const query = `
            UPDATE application_types 
            SET 
                application_type_name = $2,
                station_id = $3,
                updated_at = $4,
                updated_by = $4
            WHERE application_type_id = $1 
            AND station_id = $5
            AND is_deleted = false
            RETURNING *
        `;

        const values = [
            application_type_id,
            application_type_name,
            station_id,
            new Date(),
            req.user.id || 'system'
        ];

        const [updatedType] = await db.query(query, {
            bind: values,
            type: QueryTypes.SELECT
        });

        if (!updatedType) {
            return res.status(404).json({
                status: "error",
                message: "Application type not found or already deleted"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Application type updated successfully",
            data: updatedType
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const getAllApplicationTypes = async (req, res) => {
    try {
        const { station_id } = req.body;

        let query = `
            SELECT 
                application_type_id,
                application_type_name,
                created_at,
                updated_at,
                station_id
            FROM application_types
            WHERE is_deleted = false
            AND station_id = $1
            ORDER BY created_at DESC
        `;

        const applicationTypes = await db.query(query, {
            bind: [station_id],
            type: QueryTypes.SELECT
        });

        res.status(200).json({
            status: "success",
            data: applicationTypes
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const deleteApplicationType = async (req, res) => {
    try {
        const { application_type_id } = req.body;

        const query = `
            UPDATE application_types 
            SET 
                is_active = false,
                is_deleted = true,
                deleted_at = $2,
                deleted_by = $3,
                updated_at = $2,
                updated_by = $3
            WHERE application_type_id = $1 
            AND is_deleted = false
            RETURNING *
        `;

        const values = [
            application_type_id,
            new Date(),
            req.user.id || 'system'
        ];

        const [deletedType] = await db.query(query, {
            bind: values,
            type: QueryTypes.SELECT
        });

        if (!deletedType) {
            return res.status(404).json({
                status: "error", 
                message: "Application type not found or already deleted"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Application type deleted successfully",
            data: deletedType
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};



export const createApplicationClassification = async (req, res) => {
    try {
        const { application_classification_name, station_id } = req.body;

        const application_classification_id = uuidv4();

        const query = `
            INSERT INTO application_classifications (
                application_classification_id,
                application_classification_name,
                station_id,
                created_at,
                created_by,
                updated_at,
                updated_by,
                is_active,
                is_deleted
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `;

        const values = [
            application_classification_id,
            application_classification_name,
            station_id,
            new Date(),
            req.user.id || 'system',
            new Date(),
            req.user.id || 'system',
            true,
            false
        ];

        await db.query(query, {
            bind: values,
            type: QueryTypes.INSERT
        });

        res.status(201).json({
            status: "success",
            message: "Application classification created successfully",
            data: {
                application_classification_id,
                application_classification_name
            }
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const getApplicationClassificationById = async (req, res) => {
    try {
        const { application_classification_id, station_id } = req.body;

        const query = `
            SELECT 
                application_classification_id,
                application_classification_name,
                station_id,
                created_at,
                updated_at
            FROM application_classifications
            WHERE application_classification_id = $1 
            AND station_id = $2
            AND is_deleted = false
            AND deleted_at IS NULL
        `;

        const [classification] = await db.query(query, {
            bind: [application_classification_id, station_id],
            type: QueryTypes.SELECT
        });

        if (!classification) {
            return res.status(404).json({
                status: "error",
                message: "Application classification not found"
            });
        }

        res.status(200).json({
            status: "success",
            data: classification
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const updateApplicationClassification = async (req, res) => {
    try {
        const { application_classification_id, application_classification_name, station_id } = req.body;

        const query = `
            UPDATE application_classifications 
            SET 
                application_classification_name = $2,
                station_id = $3,
                updated_at = $4,
                updated_by = $5
            WHERE application_classification_id = $1 
            AND station_id = $3
            AND is_deleted = false
            RETURNING *
        `;

        const values = [
            application_classification_id,
            application_classification_name,
            station_id,
            new Date(),
            req.user.id || 'system'
        ];

        const [updatedClassification] = await db.query(query, {
            bind: values,
            type: QueryTypes.SELECT
        });

        if (!updatedClassification) {
            return res.status(404).json({
                status: "error",
                message: "Application classification not found or already deleted"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Application classification updated successfully",
            data: updatedClassification
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const getAllApplicationClassifications = async (req, res) => {
    try {
        const { station_id } = req.body;

        const query = `
            SELECT 
                application_classification_id,
                application_classification_name,
                created_at,
                updated_at,
                station_id
            FROM application_classifications
            WHERE is_deleted = false
            AND station_id = $1
            ORDER BY created_at DESC
        `;

        const classifications = await db.query(query, {
            bind: [station_id],
            type: QueryTypes.SELECT
        });

        res.status(200).json({
            status: "success",
            data: classifications
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const deleteApplicationClassification = async (req, res) => {
    try {
        const { application_classification_id } = req.body;

        const query = `
            UPDATE application_classifications 
            SET 
                is_active = false,
                is_deleted = true,
                deleted_at = $2,
                deleted_by = $3,
                updated_at = $2,
                updated_by = $3
            WHERE application_classification_id = $1 
            AND is_deleted = false
            RETURNING *
        `;

        const values = [
            application_classification_id,
            new Date(),
            req.user.id || 'system'
        ];

        const [deletedClassification] = await db.query(query, {
            bind: values,
            type: QueryTypes.SELECT
        });

        if (!deletedClassification) {
            return res.status(404).json({
                status: "error",
                message: "Application classification not found or already deleted"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Application classification deleted successfully",
            data: deletedClassification
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

