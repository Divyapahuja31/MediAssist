import * as medicationService from './medication.service.js';
import { ok, created } from '../../utils/response.helper.js';

export const create = async (req, res, next) => {
    try {
        const medication = await medicationService.create(req.user.id, req.body);
        return created(res, medication, 'Medication created successfully');
    } catch (error) {
        next(error);
    }
};

export const list = async (req, res, next) => {
    try {
        const medications = await medicationService.listByUser(req.user.id);
        return ok(res, medications, 'Medications fetched successfully');
    } catch (error) {
        next(error);
    }
};

export const get = async (req, res, next) => {
    try {
        const medication = await medicationService.getById(req.user.id, req.params.id);
        return ok(res, medication, 'Medication fetched successfully');
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    try {
        const medication = await medicationService.update(req.user.id, req.params.id, req.body);
        return ok(res, medication, 'Medication updated successfully');
    } catch (error) {
        next(error);
    }
};

export const remove = async (req, res, next) => {
    try {
        await medicationService.remove(req.user.id, req.params.id);
        return ok(res, null, 'Medication deleted successfully');
    } catch (error) {
        next(error);
    }
};
