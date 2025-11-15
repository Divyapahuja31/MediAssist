import axios from 'axios';
import { getItem } from '../services/storageHelper';
import { STORAGE_KEYS, API_BASE_URL } from '../utils/constants';

console.log('API_BASE_URL configured as:', API_BASE_URL);

const API = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const setAuthToken = (token) => {
    if (token) {
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete API.defaults.headers.common['Authorization'];
    }
};

API.interceptors.request.use(
    async (config) => {
        if (config.headers.Authorization) {
            return config;
        }

        const token = await getItem(STORAGE_KEYS.TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.message === 'Network Error') {
            console.error(`Network Error: Unable to reach ${API_BASE_URL}`);
            console.error('Ensure backend is running and accessible from this device.');
        }
        return Promise.reject(error);
    }
);

export default API;
