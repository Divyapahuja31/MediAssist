import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import prisma from '../config/db.js';
import { fail } from '../utils/response.helper.js';

export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, config.jwtSecret);

            // Fetch user and profile
            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
                include: { profile: true },
            });

            if (!user) {
                return fail(res, 401, 'User not found');
            }

            req.user = { id: user.id, email: user.email, role: user.role };
            req.profile = user.profile;

            next();
        } catch (error) {
            console.error('Auth error:', error);
            return fail(res, 401, 'Not authorized, token failed');
        }
    } else {
        return fail(res, 401, 'Not authorized, no token');
    }
};

export const requireRole = (role) => {
    return (req, res, next) => {
        if (req.user && req.user.role === role) {
            next();
        } else {
            return fail(res, 403, 'Forbidden: Insufficient rights');
        }
    };
};
