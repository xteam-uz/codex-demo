import api from './api';

export const fetchLeadership = (params = {}) => api.get('/leadership', { params });
