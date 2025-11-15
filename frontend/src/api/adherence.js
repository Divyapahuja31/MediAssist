import api from './api';

export const listAdherenceLogs = (params) => {
    return api.get('/adherence', { params });
};

export const createAdherenceLog = (data) => {
    return api.post('/adherence', data);
};

export const getAdherenceSummary = (params) => {
    return api.get('/adherence/summary', { params });
};
