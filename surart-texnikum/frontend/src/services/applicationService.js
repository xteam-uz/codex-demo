import api from './api';

export const fetchApplication = (params = {}) => api.get('/application', { params });
