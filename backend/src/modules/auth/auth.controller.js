import * as authService from './auth.service.js';
import { ok, created, fail } from '../../utils/response.helper.js';

export const register = async (req, res, next) => {
    try {
        console.log('Register request received:', req.body);
        const user = await authService.register(req.body);
        return created(res, user, 'User registered successfully');
    } catch (error) {
        console.error('Register Error:', error);
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        return ok(res, result, 'Login successful');
    } catch (error) {
        next(error);
    }
};

export const getMe = async (req, res, next) => {
    try {
        const user = await authService.getMe(req.user.id);
        return ok(res, user, 'User profile fetched successfully');
    } catch (error) {
        next(error);
    }
};
