import api from './api';

export const getProfile = (userId = 'me') => {
    return api.get(`/profile/${userId}`);
};

export const upsertProfile = (data) => {
    return api.post('/profile/me', data);
};

export const getEmergencyContacts = (userId = 'me') => {
    return api.get(`/profile/${userId}/emergency`);
};

export const createEmergencyToken = () => {
    return api.post('/profile/emergency-token');
};

export const getEmergencyToken = () => {
    return api.get('/profile/emergency-token');
};

export const revokeEmergencyToken = (token) => {
    return api.delete(`/profile/emergency-token/${token}`);
};
