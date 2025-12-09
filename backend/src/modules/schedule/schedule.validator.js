import Joi from 'joi';

export const createScheduleSchema = Joi.object({
    medicationId: Joi.string().required(),
    timeOfDay: Joi.string().pattern(/^\d{1,2}:\d{2}$/).required(),
    timezone: Joi.string().required(),
    frequency: Joi.string().valid('DAILY', 'WEEKLY', 'ONCE').required(),
    daysOfWeek: Joi.array().items(Joi.number().min(1).max(7)).optional(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
    dosage: Joi.string().optional(),
    active: Joi.boolean().optional(),
});

export const updateScheduleSchema = Joi.object({
    medicationId: Joi.string().optional(),
    timeOfDay: Joi.string().pattern(/^\d{1,2}:\d{2}$/).optional(),
    timezone: Joi.string().optional(),
    frequency: Joi.string().valid('DAILY', 'WEEKLY', 'ONCE').optional(),
    daysOfWeek: Joi.array().items(Joi.number().min(1).max(7)).optional(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
    dosage: Joi.string().optional(),
    active: Joi.boolean().optional(),
});
