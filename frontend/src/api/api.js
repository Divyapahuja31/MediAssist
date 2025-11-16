import axios from 'axios';
import { getItem } from '../services/storageHelper';
import { STORAGE_KEYS } from '../utils/constants';

const api = axios.create({
    baseURL: 'http://11.6.1.209:5001/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

api.interceptors.request.use(
    async (config) => {
        const token = await getItem(STORAGE_KEYS.TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
        }
        return Promise.reject(error);
    }
);

export const getAvatarUrl = (firstName = "", lastName = "") => {
    const name = `${(firstName || "").trim()} ${(lastName || "").trim()}`.trim() || "User";
   
    const encoded = encodeURIComponent(name).replace(/%20/g, "+");
    return `https://ui-avatars.com/api/?name=${encoded}&background=00b894&color=fff&size=128&bold=true`;
};

export default api;