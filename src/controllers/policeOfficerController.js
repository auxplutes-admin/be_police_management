import db from "../database/config.js";
import { QueryTypes } from "sequelize";
import { v4 as uuidv4 } from 'uuid';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import OfficerSession from '../models/officerSessionModel.js';

export const login = async (req, res) => {
    try {
        const { email, password, sessionInfo } = req.body;

        // Get officer details
        const query = `
            SELECT *
            FROM police_officers 
            WHERE officer_email = $1 
            AND is_deleted = false
            AND is_active = true
        `;

        const [officer] = await db.query(query, {
            bind: [email],
            type: QueryTypes.SELECT
        });

        if (!officer) {
            return res.status(401).json({
                status: "error",
                message: "No police officer account found with this email. Please check your email or contact your administrator."
            });
        }

        // Verify password
        const isValidPassword = await bcryptjs.compare(password, officer.officer_password);
        if (!isValidPassword) {
            return res.status(401).json({
                status: "error", 
                message: "Invalid credentials"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: officer.officer_id, 
                email: officer.officer_email,
                role: officer.officer_designation
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Create session
        const session = await OfficerSession.create({
            officer_id: officer.officer_id,
            officer_email: email,
            ip_address: sessionInfo.ip_address,
            device_info: sessionInfo.device_info,
            latitude: sessionInfo.latitude,
            longitude: sessionInfo.longitude,
            session_metadata: sessionInfo,
            token: token,
            is_active: true
        });

        res.status(200).json({
            status: "success",
            message: "Login successful",
            data: {
                officer: {
                    id: officer.officer_id,
                    name: officer.officer_name,
                    email: officer.officer_email,
                    designation: officer.officer_designation,
                    username: officer.officer_username,
                    password: officer.officer_password,
                    joining_date: officer.officer_joining_date,
                    status: officer.officer_status
                },
                token,
                session_id: session.session_id
            }
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const logout = async (req, res) => {
    try {
        const { session_id } = req.body;

        const session = await OfficerSession.findOne({
            where: {
                session_id: session_id,
                is_active: true
            }
        });

        if (!session) {
            return res.status(404).json({
                status: "error",
                message: "Session not found or already expired"
            });
        }

        // Update session
        await session.update({
            is_active: false,
            logout_time: new Date()
        });

        res.status(200).json({
            status: "success",
            message: "Logged out successfully"
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const createPoliceOfficer = async (req, res) => {

    try {
        const { 
            station_id,
            officer_name, 
            officer_designation, 
            officer_badge_number, 
            officer_mobile_number, 
            officer_email, 
            officer_username,
            officer_password,
            officer_joining_date, 
            officer_status 
        } = req.body;

        const officer_id = uuidv4();
        const now = new Date();

        // Hash the password
        const hashedPassword = await bcryptjs.hash(officer_password, 10);

        const query = `
            INSERT INTO police_officers (officer_id, 
            station_id, officer_name, officer_designation, 
            officer_badge_number, officer_mobile_number, 
            officer_email, officer_username, officer_password, officer_joining_date, officer_status, 
            created_at, created_by, updated_at, updated_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        `;

        const values = [
            officer_id, 
            station_id,
            officer_name, 
            officer_designation, 
            officer_badge_number, 
            officer_mobile_number, 
            officer_email, 
            officer_username,
            hashedPassword,
            now, 
            officer_status, 
            now,
            null, 
            now,
            null 
        ];
        
        const [result] = await db.query(query,{
            bind: values,
            type: QueryTypes.INSERT
        });

        res.status(201).json({ 
            status: "success",
            message: "Police officer created successfully", 
            data: result[0]
        });
    } catch (error) {
        res.status(500).json({ 
            status: "error",
            message: error.message
        });
    }

}
export const getPoliceOfficerById = async (req, res) => {
    try {
        const { id } = req.user;

        const query = `
            SELECT 
                *
            FROM police_officers po
            WHERE po.officer_id = $1 
            AND po.is_deleted = false
        `;

        const [officer] = await db.query(query, {
            bind: [id],
            type: QueryTypes.SELECT
        });

        if (!officer) {
            return res.status(404).json({
                status: "error",
                message: "Police officer not found"
            });
        }

        // Remove sensitive fields
        delete officer.officer_password;

        res.status(200).json({
            status: "success",
            data: officer
        });

    } catch (error) {
        res.status(500).json({
            status: "error", 
            message: error.message
        });
    }
}

export const getAllPoliceOfficers = async (req, res) => {
    try {
        const { station_id, page, limit } = req.body;
        
        let query = `
            SELECT 
                po.officer_id,
                po.station_id,
                po.officer_name,
                po.officer_designation,
                po.officer_badge_number,
                po.officer_mobile_number,
                po.officer_username,
                po.officer_email,
                po.officer_joining_date,
                po.officer_status,
                po.created_at,
                po.updated_at,
                po.created_by,
                po.updated_by,
                po.deleted_at,
                po.deleted_by,
                po.is_active,
                po.is_deleted,
                ps.station_name,
                ps.station_address
            FROM police_officers po
            LEFT JOIN police_stations ps ON po.station_id = ps.station_id
            WHERE po.is_deleted = false
        `;

        const queryParams = [];

        if (station_id) {
            queryParams.push(station_id);
            query += ` AND po.station_id = $${queryParams.length}`;
        }

        // Add pagination if page and limit are provided
        if (page && limit) {
            const offset = (parseInt(page) - 1) * parseInt(limit);
            
            // Get total count for pagination
            const countQuery = `
                SELECT COUNT(*) as total 
                FROM police_officers po 
                WHERE po.is_deleted = false
                ${station_id ? ' AND po.station_id = $1' : ''}
            `;
            
            const [totalResult] = await db.query(countQuery, {
                bind: station_id ? [station_id] : [],
                type: QueryTypes.SELECT
            });

            const total = parseInt(totalResult.total);
            const totalPages = Math.ceil(total / parseInt(limit));

            queryParams.push(limit, offset);
            query += ` LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}`;

            const officers = await db.query(query, {
                bind: queryParams,
                type: QueryTypes.SELECT
            });

            return res.status(200).json({
                status: "success",
                data: officers,
                pagination: {
                    total,
                    totalPages,
                    currentPage: parseInt(page),
                    limit: parseInt(limit)
                }
            });
        }

        // If no pagination, return all records
        const officers = await db.query(query, {
            bind: queryParams,
            type: QueryTypes.SELECT
        });

        res.status(200).json({
            status: "success",
            data: officers
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const updatePoliceOfficer = async (req, res) => {
    try {
        const { officer_id } = req.body;
        const updateData = req.body;

        // Remove sensitive fields that shouldn't be updated directly
        delete updateData.officer_id;
        delete updateData.created_at;
        delete updateData.created_by;
        delete updateData.deleted_at;
        delete updateData.deleted_by;
        
        // Add audit fields
        updateData.updated_at = new Date();
        updateData.updated_by = req.user.id;

        const query = `
            UPDATE police_officers 
            SET ${Object.keys(updateData).map((key, index) => `${key} = $${index + 2}`).join(', ')}
            WHERE officer_id = $1 AND is_deleted = false
            RETURNING *
        `;

        const values = [officer_id, ...Object.values(updateData)];
        
        const [updatedOfficer] = await db.query(query, {
            bind: values,
            type: QueryTypes.SELECT
        });

        if (!updatedOfficer) {
            return res.status(404).json({
                status: "error",
                message: "Police officer not found or already deleted"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Police officer updated successfully",
            data: updatedOfficer
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};


export const deletePoliceOfficerById = async (req, res) => {
    try {
        const { officer_id } = req.body;

        // Soft delete by updating is_deleted flag and audit fields
        const query = `
            UPDATE police_officers 
            SET is_deleted = true,
                deleted_at = $2,
                deleted_by = $3,
                is_active = false
            WHERE officer_id = $1 AND is_deleted = false
            RETURNING *
        `;

        const values = [
            officer_id,
            new Date(),
            req.user.id
        ];

        const [deletedOfficer] = await db.query(query, {
            bind: values,
            type: QueryTypes.SELECT
        });

        if (!deletedOfficer) {
            return res.status(404).json({
                status: "error", 
                message: "Police officer not found or already deleted"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Police officer deleted successfully",
            data: deletedOfficer
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const getOfficerSessionsByOfficerId = async (req, res) => {
    try {
        const { officer_id } = req.body;

        // Get all sessions for the officer
        const sessions = await OfficerSession.findAll({
            where: {
                officer_id: officer_id
            },
            order: [['login_time', 'DESC']]
        });

        if (!sessions || sessions.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "No sessions found for this officer"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Officer sessions retrieved successfully",
            data: sessions
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

export const getOfficerByIdAndStation = async (req, res) => {
    try {
        const { officer_id, station_id } = req.body;

        const query = `
            SELECT 
                po.*,
                ps.station_name,
                ps.station_address
            FROM police_officers po
            LEFT JOIN police_stations ps ON po.station_id = ps.station_id 
            WHERE po.officer_id = $1
            AND po.station_id = $2
            AND po.is_deleted = false
        `;

        const [officer] = await db.query(query, {
            bind: [officer_id, station_id],
            type: QueryTypes.SELECT
        });

        if (!officer) {
            return res.status(404).json({
                status: "error",
                message: "Police officer not found"
            });
        }

        // Remove sensitive fields
        delete officer.officer_password;

        res.status(200).json({
            status: "success",
            data: officer
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};
