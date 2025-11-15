import api from './api';

export const getProfile = async () => {
    const response = await api.get('/api/profile/me');
    return response.data;
};

export const updateProfile = async (profileData) => {
    const response = await api.patch('/api/profile/update', profileData);
    return response.data;
};

export const getEmergencyCard = async () => {
    const response = await api.get('/api/profile/emergency-card');
    return response.data;
};
