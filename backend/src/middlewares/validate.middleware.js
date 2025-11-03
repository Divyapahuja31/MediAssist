import { fail } from '../utils/response.helper.js';

export const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errorMessages = error.details.map((detail) => detail.message);
            return fail(res, 400, errorMessages.join(', '));
        }

        next();
    };
};
