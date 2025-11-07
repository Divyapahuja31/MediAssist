import * as adherenceService from './adherence.service.js';
import { ok, created } from '../../utils/response.helper.js';

export const create = async (req, res, next) => {
    try {
        const log = await adherenceService.createLog(req.user.id, req.body);
        return created(res, log, 'Adherence logged successfully');
    } catch (error) {
        next(error);
    }
};

export const list = async (req, res, next) => {
    try {
        const logs = await adherenceService.listByUser(req.user.id, req.query);
        return ok(res, logs, 'Adherence logs fetched successfully');
    } catch (error) {
        next(error);
    }
};
