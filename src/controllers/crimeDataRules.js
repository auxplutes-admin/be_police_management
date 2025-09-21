import db from "../database/config.js";
import { QueryTypes } from "sequelize";
import { v4 as uuidv4 } from 'uuid';

export const createCrimePart = async (req, res) => {
    try {
        const { crime_part_name, station_id } = req.body;

        const crime_part_id = uuidv4();

        const query = `
            INSERT INTO crime_parts (
                crime_part_id,
                crime_part_name,
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
            crime_part_id,
            crime_part_name,
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
            message: "Crime part created successfully",
            data: {
                crime_part_id,
                crime_part_name,
                station_id
            }
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const getCrimePartById = async (req, res) => {
    try {
        const { crime_part_id, station_id } = req.body;

        const query = `
            SELECT 
                crime_part_id,
                crime_part_name,
                station_id,
                created_at,
                updated_at
            FROM crime_parts
            WHERE crime_part_id = $1
            AND station_id = $2
            AND is_deleted = false
            AND deleted_at IS NULL
        `;

        const [crimePart] = await db.query(query, {
            bind: [crime_part_id, station_id],
            type: QueryTypes.SELECT
        });

        if (!crimePart) {
            return res.status(404).json({
                status: "error",
                message: "Crime part not found"
            });
        }

        res.status(200).json({
            status: "success",
            data: crimePart
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const updateCrimePart = async (req, res) => {
    try {
        const { crime_part_id, crime_part_name, station_id } = req.body;

        const query = `
            UPDATE crime_parts 
            SET 
                crime_part_name = $2,
                station_id = $3,
                updated_at = $4,
                updated_by = $5
            WHERE crime_part_id = $1 
            AND is_deleted = false
            RETURNING *
        `;

        const values = [
            crime_part_id,
            crime_part_name,
            station_id,
            new Date(),
            req.user.id || 'system'
        ];

        const [updatedPart] = await db.query(query, {
            bind: values,
            type: QueryTypes.SELECT
        });

        if (!updatedPart) {
            return res.status(404).json({
                status: "error",
                message: "Crime part not found or already deleted"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Crime part updated successfully",
            data: updatedPart
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const getAllCrimeParts = async (req, res) => {
    try {
        const { station_id } = req.body;

        const query = `
            SELECT 
                *
            FROM crime_parts
            WHERE is_deleted = false
            AND station_id = $1
            ORDER BY created_at DESC
        `;

        const crimeParts = await db.query(query, {
            bind: [station_id],
            type: QueryTypes.SELECT
        });

        res.status(200).json({
            status: "success",
            data: crimeParts
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const deleteCrimePart = async (req, res) => {
    try {
        const { crime_part_id, station_id } = req.body;

        const query = `
            UPDATE crime_parts 
            SET 
                is_active = false,
                is_deleted = true,
                deleted_at = $3,
                deleted_by = $4,
                updated_at = $3,
                updated_by = $4
            WHERE crime_part_id = $1 
            AND station_id = $2
            AND is_deleted = false
            RETURNING *
        `;

        const values = [
            crime_part_id,
            station_id,
            new Date(),
            req.user.id || 'system'
        ];

        const [deletedPart] = await db.query(query, {
            bind: values,
            type: QueryTypes.SELECT
        });

        if (!deletedPart) {
            return res.status(404).json({
                status: "error",
                message: "Crime part not found or already deleted"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Crime part deleted successfully",
            data: deletedPart
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const createCrimeType = async (req, res) => {
    try {
        const { crime_type_name, station_id } = req.body;

        const crime_type_id = uuidv4();

        const query = `
            INSERT INTO crime_types (
                crime_type_id,
                crime_type_name,
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
            crime_type_id,
            crime_type_name,
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
            message: "Crime type created successfully",
            data: {
                crime_type_id,
                crime_type_name,
                station_id
            }
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const getCrimeTypeById = async (req, res) => {
    try {
        const { crime_type_id, station_id } = req.body;

        const query = `
            SELECT 
                crime_type_id,
                crime_type_name,
                station_id,
                created_at,
                updated_at,
                is_active
            FROM crime_types
            WHERE crime_type_id = $1
            AND station_id = $2
            AND is_deleted = false
        `;

        const [crimeType] = await db.query(query, {
            bind: [crime_type_id, station_id],
            type: QueryTypes.SELECT
        });

        if (!crimeType) {
            return res.status(404).json({
                status: "error",
                message: "Crime type not found"
            });
        }

        res.status(200).json({
            status: "success",
            data: crimeType
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const getAllCrimeTypes = async (req, res) => {
    try {
        const { station_id } = req.body;

        const query = `
            SELECT 
                *
            FROM crime_types
            WHERE is_deleted = false
            AND station_id = $1
            ORDER BY created_at DESC
        `;

        const crimeTypes = await db.query(query, {
            bind: [station_id],
            type: QueryTypes.SELECT
        });

        res.status(200).json({
            status: "success",
            data: crimeTypes
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const updateCrimeType = async (req, res) => {
    try {
        const { crime_type_id, crime_type_name, station_id } = req.body;

        const query = `
            UPDATE crime_types 
            SET 
                crime_type_name = $2,
                station_id = $3,
                updated_at = $4,
                updated_by = $5
            WHERE crime_type_id = $1 
            AND is_deleted = false
            RETURNING *
        `;

        const values = [
            crime_type_id,
            crime_type_name,
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
                message: "Crime type not found"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Crime type updated successfully",
            data: updatedType
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const deleteCrimeType = async (req, res) => {
    try {
        const { crime_type_id, station_id } = req.body;

        const query = `
            UPDATE crime_types 
            SET 
                is_active = false,
                is_deleted = true,
                deleted_at = $3,
                deleted_by = $4,
                updated_at = $3,
                updated_by = $4
            WHERE crime_type_id = $1 
            AND station_id = $2
            AND is_deleted = false
            RETURNING *
        `;

        const values = [
            crime_type_id,
            station_id,
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
                message: "Crime type not found or already deleted"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Crime type deleted successfully",
            data: deletedType
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};



export const createCrimeSubType = async (req, res) => {
    try {
        const { crime_type_id, crime_type_name, crime_subtype_name, station_id } = req.body;

        const crime_subtype_id = uuidv4();

        const query = `
            INSERT INTO crime_subtypes (
                crime_subtype_id,
                crime_type_id,
                crime_type_name,
                crime_subtype_name,
                station_id,
                created_at,
                created_by,
                updated_at,
                updated_by,
                is_active,
                is_deleted
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `;

        const values = [
            crime_subtype_id,
            crime_type_id,
            crime_type_name,
            crime_subtype_name,
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
            message: "Crime subtype created successfully",
            data: {
                crime_subtype_id,
                crime_type_id,
                crime_subtype_name,
                station_id
            }
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const getCrimeSubTypeById = async (req, res) => {
    try {
        const { crime_subtype_id, station_id } = req.body;

        const query = `
            SELECT 
                crime_subtype_id,
                crime_type_id,
                crime_type_name,
                crime_subtype_name,
                station_id,
                created_at,
                updated_at,
                is_active
            FROM crime_subtypes
            WHERE crime_subtype_id = $1
            AND station_id = $2
            AND is_deleted = false
        `;

        const [crimeSubType] = await db.query(query, {
            bind: [crime_subtype_id, station_id],
            type: QueryTypes.SELECT
        });

        if (!crimeSubType) {
            return res.status(404).json({
                status: "error",
                message: "Crime subtype not found"
            });
        }

        res.status(200).json({
            status: "success",
            data: crimeSubType
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const getAllCrimeSubTypes = async (req, res) => {
    try {
        const { station_id } = req.body;

        const query = `
            SELECT 
                *
            FROM crime_subtypes
            WHERE is_deleted = false
            AND station_id = $1
            ORDER BY created_at DESC
        `;

        const crimeSubTypes = await db.query(query, {
            bind: [station_id],
            type: QueryTypes.SELECT
        });

        res.status(200).json({
            status: "success",
            data: crimeSubTypes
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const updateCrimeSubType = async (req, res) => {
    try {
        const { crime_subtype_id, crime_type_name, crime_type_id, crime_subtype_name, station_id } = req.body;

        const query = `
            UPDATE crime_subtypes 
            SET 
                crime_type_id = $2,
                crime_type_name = $3,
                crime_subtype_name = $4,
                station_id = $4,
                updated_at = $5,
                updated_by = $6
            WHERE crime_subtype_id = $1 
            AND is_deleted = false
            RETURNING *
        `;

        const values = [
            crime_subtype_id,
            crime_type_id,
            crime_type_name,
            crime_subtype_name,
            station_id,
            new Date(),
            req.user.id || 'system'
        ];

        const [updatedSubType] = await db.query(query, {
            bind: values,
            type: QueryTypes.SELECT
        });

        if (!updatedSubType) {
            return res.status(404).json({
                status: "error",
                message: "Crime subtype not found"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Crime subtype updated successfully",
            data: updatedSubType
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const deleteCrimeSubType = async (req, res) => {
    try {
        const { crime_subtype_id, station_id } = req.body;

        const query = `
            UPDATE crime_subtypes 
            SET 
                is_active = false,
                is_deleted = true,
                deleted_at = $3,
                deleted_by = $4,
                updated_at = $3,
                updated_by = $4
            WHERE crime_subtype_id = $1 
            AND station_id = $2
            AND is_deleted = false
            RETURNING *
        `;

        const values = [
            crime_subtype_id,
            station_id,
            new Date(),
            req.user.id || 'system'
        ];

        const [deletedSubType] = await db.query(query, {
            bind: values,
            type: QueryTypes.SELECT
        });

        if (!deletedSubType) {
            return res.status(404).json({
                status: "error",
                message: "Crime subtype not found or already deleted"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Crime subtype deleted successfully",
            data: deletedSubType
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};
