import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/db.js';
import { config } from '../../config/env.js';

export const register = async (data) => {
    const { name, email, password, phone } = data;

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        const error = new Error('Email already in use');
        error.statusCode = 409;
        throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const user = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
            data: {
                email: email.toLowerCase(),
                passwordHash,
                role: 'PATIENT',
            },
        });

        const newProfile = await tx.profile.create({
            data: {
                userId: newUser.id,
                name,
                phone,
            },
        });

        newUser.profile = newProfile;

        return newUser;
    });

    const token = jwt.sign(
        { id: user.id, role: user.role },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
    );

    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
        token,
        user: userWithoutPassword
    };
};

export const login = async (email, password) => {
    const user = await prisma.user.findUnique({
        where: { email },
        include: { profile: true },
    });

    if (!user) {
        const error = new Error('Invalid credentials');
        error.statusCode = 401;
        throw error;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        const error = new Error('Invalid credentials');
        error.statusCode = 401;
        throw error;
    }

    const token = jwt.sign(
        { id: user.id, role: user.role },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
    );

    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
        token,
        user: userWithoutPassword,
    };
};

export const getMe = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true },
    });

    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};
