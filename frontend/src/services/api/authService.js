import { apiClient } from './index';

export const authService = {
  login(payload) {
    return apiClient.post('/v1/auth/login', payload).then((res) => res.data);
  },
  register(payload) {
    return apiClient.post('/v1/auth/register', payload).then((res) => res.data);
  },
};
