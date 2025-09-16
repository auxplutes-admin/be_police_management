import db from "../database/config.js";
import { QueryTypes } from "sequelize";
import { v4 as uuidv4 } from 'uuid';

export const createPoliceStation = async (req, res) => {
    try {
        const {
            station_name,
            station_code,
            station_phone,
            station_email,
            station_latitude,
            station_longitude, 
            station_zone,
            station_address,
            station_city,
            station_state,
            station_jurisdiction,
            station_type,
            station_incharge
        } = req.body;

        const station_id = uuidv4();

        const query = `
            INSERT INTO police_stations (
                station_id,
                station_name,
                station_code,
                station_phone,
                station_email,
                station_latitude,
                station_longitude,
                station_zone,
                station_address,
                station_city,
                station_state,
                station_jurisdiction,
                station_type,
                station_incharge,
                created_at,
                created_by,
                updated_at,
                updated_by
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        `;

        const values = [
            station_id,
            station_name,
            station_code,
            station_phone,
            station_email,
            station_latitude,
            station_longitude,
            station_zone,
            station_address,
            station_city,
            station_state,
            station_jurisdiction,
            station_type,
            station_incharge,
            new Date(),
            null,
            new Date(),
            null
        ];

        const [result] = await db.query(query, {
            bind: values,
            type: QueryTypes.INSERT
        });

        res.status(201).json({
            status: "success",
            message: "Police station created successfully",
            data: result[0]
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};


export const getPoliceStationById = async (req, res) => {
    try {
        const { station_id } = req.body;

        const query = `
            SELECT 
                *
            FROM police_stations
            WHERE station_id = $1 
            AND deleted_at IS NULL
        `;

        const [station] = await db.query(query, {
            bind: [station_id],
            type: QueryTypes.SELECT
        });

        if (!station) {
            return res.status(404).json({
                status: "error",
                message: "Police station not found"
            });
        }

        res.status(200).json({
            status: "success",
            data: station
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};


export const updatePoliceStation = async (req, res) => {
    try {
        const {station_id, updateData }= req.body;

        // Remove sensitive fields that shouldn't be updated directly
        delete updateData.station_id;
        delete updateData.created_at;
        delete updateData.created_by;
        delete updateData.deleted_at;
        delete updateData.deleted_by;
        
        // Add audit fields
        updateData.updated_at = new Date();
        updateData.updated_by = req.user.id;

        const query = `
            UPDATE police_stations 
            SET ${Object.keys(updateData).map((key, index) => `${key} = $${index + 2}`).join(', ')}
            WHERE station_id = $1 AND deleted_at IS NULL
            RETURNING *
        `;

        const values = [station_id, ...Object.values(updateData)];
        
        const [updatedStation] = await db.query(query, {
            bind: values,
            type: QueryTypes.SELECT
        });

        if (!updatedStation) {
            return res.status(404).json({
                status: "error",
                message: "Police station not found or already deleted"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Police station updated successfully",
            data: updatedStation
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const deletePoliceStationById = async (req, res) => {
    try {
        const { station_id } = req.body;

        // Soft delete by updating deleted_at and audit fields
        const query = `
            UPDATE police_stations 
            SET deleted_at = $2,
                deleted_by = $3
            WHERE station_id = $1 AND deleted_at IS NULL
            RETURNING *
        `;

        const values = [
            station_id,
            new Date(),
            req.user.id
        ];

        const [deletedStation] = await db.query(query, {
            bind: values,
            type: QueryTypes.SELECT
        });

        if (!deletedStation) {
            return res.status(404).json({
                status: "error",
                message: "Police station not found or already deleted"
            });
        }

        res.status(200).json({
            status: "success", 
            message: "Police station deleted successfully",
            data: deletedStation
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

