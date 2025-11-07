import Joi from 'joi';

export const registerDeviceSchema = Joi.object({
    expoPushToken: Joi.string().required(),
    platform: Joi.string().valid('ios', 'android', 'web').default('web'),
});
