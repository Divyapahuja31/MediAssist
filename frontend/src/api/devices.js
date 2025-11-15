import api from './api';

export const registerDevice = (data) => {
    return api.post('/devices/register', data);
};

export const listDevices = () => {
    return api.get('/devices');
};

export const deleteDevice = (deviceId) => {
    return api.delete(`/devices/${deviceId}`);
};
