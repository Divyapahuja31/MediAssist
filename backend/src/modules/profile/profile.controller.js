import * as profileService from './profile.service.js';
import { ok, created } from '../../utils/response.helper.js';

export const getMe = async (req, res, next) => {
    try {
        const profile = await profileService.getProfile(req.user.id);
        return ok(res, profile, 'Profile fetched successfully');
    } catch (error) {
        next(error);
    }
};

export const updateMe = async (req, res, next) => {
    try {
        const profile = await profileService.upsertProfile(req.user.id, req.body);
        return ok(res, profile, 'Profile updated successfully');
    } catch (error) {
        next(error);
    }
};

export const getEmergencyInfo = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const info = await profileService.getEmergencyInfo(userId);
        return ok(res, info, 'Emergency info fetched successfully');
    } catch (error) {
        next(error);
    }
};

export const createEmergencyToken = async (req, res, next) => {
    try {
        const tokenData = await profileService.createEmergencyToken(req.user.id);
        const url = `${req.protocol}://${req.get('host')}/api/profile/emergency/${tokenData.token}`;
        return created(res, { ...tokenData, url }, 'Emergency token created');
    } catch (error) {
        next(error);
    }
};

export const getEmergencyToken = async (req, res, next) => {
    try {
        const tokenData = await profileService.getEmergencyToken(req.user.id);
        if (tokenData) {
            const url = `${req.protocol}://${req.get('host')}/api/profile/emergency/${tokenData.token}`;
            return ok(res, { ...tokenData, url }, 'Emergency token fetched');
        }
        return ok(res, {}, 'No active token');
    } catch (error) {
        next(error);
    }
};

export const revokeEmergencyToken = async (req, res, next) => {
    try {
        const { token } = req.params;
        await profileService.revokeEmergencyToken(req.user.id, token);
        return ok(res, null, 'Emergency token revoked');
    } catch (error) {
        next(error);
    }
};

export const getEmergencyInfoByToken = async (req, res, next) => {
    try {
        const { token } = req.params;
        const info = await profileService.getEmergencyInfoByToken(token);
        return ok(res, info, 'Emergency info fetched');
    } catch (error) {
        next(error);
    }
};
