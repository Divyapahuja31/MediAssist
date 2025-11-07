import Joi from 'joi';

export const uploadPrescriptionSchema = Joi.object({
    medicationId: Joi.string().optional(),
    notes: Joi.string().optional(),
});
