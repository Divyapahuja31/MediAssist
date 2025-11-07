import * as deviceService from './device.service.js';
import { ok, created } from '../../utils/response.helper.js';

export const registerDevice = async (req, res, next) => {
    try {
        const result = await deviceService.upsertDevice({
            userId: req.user.id,
            ...req.body,
        });
        return created(res, result, 'Device registered successfully');
    } catch (error) {
        next(error);
    }
};

export const listDevices = async (req, res, next) => {
    try {
        const devices = await deviceService.listByUser(req.user.id);
        return ok(res, devices, 'Devices fetched successfully');
    } catch (error) {
        next(error);
    }
};

export const deleteDevice = async (req, res, next) => {
    try {
        const { expoPushToken } = req.params;
        await deviceService.deleteByToken(req.user.id, expoPushToken);
        return ok(res, null, 'Device deleted successfully');
    } catch (error) {
        next(error);
    }
};
