import api from './api';

export const getUpcomingSchedule = async (limit = 1) => {
    const response = await api.get(`/api/schedules?upcoming=true&limit=${limit}`);
    return response.data;
};

export const getSchedules = async (params) => {
    const response = await api.get('/api/schedules', { params });
    return response.data;
};

export const createSchedule = async (scheduleData) => {
    const response = await api.post('/api/schedules', scheduleData);
    return response.data;
};

export const updateSchedule = async (id, scheduleData) => {
    const response = await api.patch(`/api/schedules/${id}`, scheduleData);
    return response.data;
};

export const deleteSchedule = async (id) => {
    const response = await api.delete(`/api/schedules/${id}`);
    return response.data;
};
