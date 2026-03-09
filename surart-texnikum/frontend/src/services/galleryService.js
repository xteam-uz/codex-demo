import api from './api';

export const fetchGallery = (params = {}) => api.get('/gallery', { params });
