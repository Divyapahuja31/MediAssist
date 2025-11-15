import * as prescriptionService from './prescription.service.js';
import { ok, created, fail } from '../../utils/response.helper.js';

export const upload = async (req, res, next) => {
    try {
        if (!req.file) {
            return fail(res, 400, 'No file uploaded');
        }
        const prescription = await prescriptionService.create(req.user.id, req.file, req.body);
        return created(res, prescription, 'Prescription uploaded successfully');
    } catch (error) {
        next(error);
    }
};

export const list = async (req, res, next) => {
    try {
        const prescriptions = await prescriptionService.listByUser(req.user.id);
        return ok(res, prescriptions, 'Prescriptions fetched successfully');
    } catch (error) {
        console.error('Error listing prescriptions:', error);
        next(error);
    }
};

export const download = async (req, res, next) => {
    try {
        const result = await prescriptionService.getDownloadUrl(req.user.id, req.params.id);
        return ok(res, result, 'Download URL generated');
    } catch (error) {
        next(error);
    }
};
