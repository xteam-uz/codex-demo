import api from './api';

export const fetchLibrary = (params = {}) => api.get('/library', { params });
