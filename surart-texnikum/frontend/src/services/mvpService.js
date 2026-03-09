import api from './api';

export const fetchMvp = (params = {}) => api.get('/mvp', { params });
