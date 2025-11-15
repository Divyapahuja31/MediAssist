import api from './api';

export const getPrescriptions = async () => {
    const response = await api.get('/api/prescriptions');
    return response.data;
};

export const uploadPrescription = async (formData) => {
    const response = await api.post('/api/prescriptions', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
