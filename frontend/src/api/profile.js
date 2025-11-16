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
