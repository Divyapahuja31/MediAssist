import api from './api';

export const listSchedules = (params) => {
    return api.get('/schedules', { params });
};

export const getSchedule = (id) => {
    return api.get(`/schedules/${id}`);
};

export const createSchedule = (data) => {
    return api.post('/schedules', data);
};

export const updateSchedule = (id, data) => {
    return api.patch(`/schedules/${id}`, data);
};

export const deleteSchedule = (id) => {
    return api.delete(`/schedules/${id}`);
};

export const markScheduleTaken = (id, data) => {
    return api.post(`/schedules/${id}/mark-taken`, data);
};