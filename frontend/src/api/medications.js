import api from './api';

export const listMedications = (params) => {
    return api.get('/medications', { params });
};

export const getMedication = (id) => {
    return api.get(`/medications/${id}`);
};

export const createMedication = (data) => {
    return api.post('/medications', data);
};

export const updateMedication = (id, data) => {
    return api.patch(`/medications/${id}`, data);
};

export const deleteMedication = (id) => {
    return api.delete(`/medications/${id}`);
};
