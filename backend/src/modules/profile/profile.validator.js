import Joi from 'joi';

export const updateProfileSchema = Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    phone: Joi.string().pattern(/^[0-9+\-() ]{7,20}$/).optional().messages({
        'string.pattern.base': 'Phone number must be valid',
    }),
    dob: Joi.date().iso().optional(),
    bloodGroup: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-').optional(),
    allergies: Joi.array().items(Joi.string()).optional(),
    emergencyContacts: Joi.array().items(
        Joi.object({
            name: Joi.string().required(),
            phone: Joi.string().required(),
            relation: Joi.string().required(),
        })
    ).optional(),
});
