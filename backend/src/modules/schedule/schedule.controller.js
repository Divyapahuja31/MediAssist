import * as scheduleService from './schedule.service.js';
import { ok, created } from '../../utils/response.helper.js';

export const create = async (req, res, next) => {
    try {
        const schedule = await scheduleService.create(req.user.id, req.body);
        return created(res, schedule, 'Schedule created successfully');
    } catch (error) {
        next(error);
    }
};

export const list = async (req, res, next) => {
    try {
        const schedules = await scheduleService.listByUser(req.user.id, req.query);
        return ok(res, schedules, 'Schedules fetched successfully');
    } catch (error) {
        next(error);
    }
};

export const get = async (req, res, next) => {
    try {
        const schedule = await scheduleService.getById(req.user.id, req.params.id);
        return ok(res, schedule, 'Schedule fetched successfully');
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    try {
        const schedule = await scheduleService.update(req.user.id, req.params.id, req.body);
        return ok(res, schedule, 'Schedule updated successfully');
    } catch (error) {
        next(error);
    }
};

export const remove = async (req, res, next) => {
    try {
        await scheduleService.remove(req.user.id, req.params.id);
        return ok(res, null, 'Schedule deleted successfully');
    } catch (error) {
        next(error);
    }
};

export const markTaken = async (req, res, next) => {
    try {
        const schedule = await scheduleService.markTaken(req.user.id, req.params.id);
        return ok(res, schedule, 'Medication marked as taken');
    } catch (error) {
        next(error);
    }
};
