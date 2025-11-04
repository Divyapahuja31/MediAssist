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
