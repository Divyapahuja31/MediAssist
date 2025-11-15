import api from './api';

export const listPrescriptions = (params) => {
    return api.get('/prescriptions', { params });
};

export const uploadPrescription = (formData) => {
    return api.post('/prescriptions', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const getPrescriptionDownloadUrl = (id) => {
    return api.get(`/prescriptions/${id}/download`);
};

export const deletePrescription = (id) => {
    return api.delete(`/prescriptions/${id}`);
};