import jwt from 'jsonwebtoken';
import db from '../database/config.js';
import { QueryTypes } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export const verifyToken = async (req, res, next) => {
    try {
        let token;
        if(process.env.NODE_ENV === 'development') {
            // Handle both formats in development
            token = req.headers.authorization?.startsWith('Bearer ') 
                ? req.headers.authorization.split(' ')[1]
                : req.headers.authorization;
        }
        else {
            // Always expect Bearer token in production
            token = req.headers.authorization?.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if user exists and is active
        const query = `
            SELECT * FROM police_officers 
            WHERE officer_id = $1 AND is_deleted = false AND is_active = true
        `;
        const [user] = await db.query(query, { 
            bind: [decoded.id],
            type: QueryTypes.SELECT 
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        if (!user.is_active) {
            return res.status(401).json({ message: 'Your account has been deactivated. Please contact support.' });
        }

        // Add user info to request
        req.user = {
            id: user.officer_id,
            email: user.officer_email,
            role: user.officer_designation,
        };

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        return res.status(500).json({ message: error.message });
    }
};

export const checkRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: 'You do not have permission to perform this action'
            });
        }
        next();
    };
};

export const checkPermission = (requiredPermissions) => {
    return (req, res, next) => {
        const hasPermission = requiredPermissions.every(permission => 
            req.user.permissions.includes(permission)
        );

        if (!hasPermission) {
            return res.status(403).json({ 
                message: 'You do not have the required permissions'
            });
        }
        next();
    };
};

export const checkCompanyPermission = (requiredPermissions) => {
    return (req, res, next) => {
        const hasPermission = requiredPermissions.every(permission => 
            req.user.company_permissions.includes(permission)
        );

        if (!hasPermission) {
            return res.status(403).json({ 
                message: 'You do not have the required company permissions'
            });
        }
        next();
    };
};