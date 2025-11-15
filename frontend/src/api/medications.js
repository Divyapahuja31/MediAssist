import api from './api';

export const getMedications = async (params) => {
    const response = await api.get('/api/medications', { params });
    return response.data;
};

export const getMedicationById = async (id) => {
    const response = await api.get(`/api/medications/${id}`);
    return response.data;
};

export const createMedication = async (medicationData) => {
    const response = await api.post('/api/medications', medicationData);
    return response.data;
};

export const updateMedication = async (id, medicationData) => {
    const response = await api.patch(`/api/medications/${id}`, medicationData);
    return response.data;
};

export const deleteMedication = async (id) => {
    const response = await api.delete(`/api/medications/${id}`);
    return response.data;
};
