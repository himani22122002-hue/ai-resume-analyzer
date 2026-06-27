import api from './api';

export const getHistory = async () => {
  const response = await api.get('/resume/history');
  return response.data;
};

export const saveHistory = async (filename, atsScore) => {
  const response = await api.post('/resume/history', { filename, atsScore });
  return response.data;
};
