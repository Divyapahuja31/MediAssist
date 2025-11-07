import Joi from 'joi';

export const createMedicationSchema = Joi.object({
    name: Joi.string().required().min(1).max(100),
    formulation: Joi.string().optional().allow('', null),
    notes: Joi.string().optional().allow('', null),
    stock: Joi.number().integer().min(0).optional(),
});

export const updateMedicationSchema = Joi.object({
    name: Joi.string().min(1).max(100).optional(),
    formulation: Joi.string().optional().allow('', null),
    notes: Joi.string().optional().allow('', null),
    stock: Joi.number().integer().min(0).optional(),
});
