import api from './api';

import { getItem } from '../services/storageHelper';
import { STORAGE_KEYS, API_BASE_URL } from '../utils/constants';

export const listPrescriptions = (params) => {
    return api.get('/prescriptions', { params });
};

export const uploadPrescription = async (formData) => {
    const token = await getItem(STORAGE_KEYS.TOKEN);
    const url = `${API_BASE_URL}/api/prescriptions/upload`;

    console.log('Uploading to:', url);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                // Content-Type is automatically set with boundary by fetch
            },
            body: formData,
        });

        const responseText = await response.text();
        console.log('Upload response status:', response.status);
        console.log('Upload response body:', responseText);

        if (!response.ok) {
            let errorMessage = 'Upload failed';
            try {
                const errorData = JSON.parse(responseText);
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                // responseText was not JSON
            }
            throw new Error(errorMessage);
        }

        return JSON.parse(responseText);
    } catch (error) {
        console.error('Upload error details:', error);
        throw error;
    }
};

export const getPrescriptionDownloadUrl = (id) => {
    return api.get(`/prescriptions/${id}/download`);
};

export const deletePrescription = (id) => {
    return api.delete(`/prescriptions/${id}`);
};