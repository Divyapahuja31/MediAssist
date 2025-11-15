import api from './api';

export const getAdherenceSummary = async (days = 7) => {
    const response = await api.get(`/api/adherence?summary=true&days=${days}`);
    return response.data;
};

export const markDoseTaken = async (scheduleId) => {
    const response = await api.post('/api/adherence/mark', { scheduleId });
    return response.data;
};

export const getAdherenceHistory = async (from, to) => {
    const response = await api.get(`/api/adherence?from=${from}&to=${to}`);
    return response.data;
};
