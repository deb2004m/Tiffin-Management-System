import { apiClient } from './index';

export const attendanceService = {
  list(params) {
    return apiClient.get('/v1/attendance', { params }).then((res) => res.data);
  },
  getById(id) {
    return apiClient.get(`/v1/attendance/${id}`).then((res) => res.data);
  },
  create(payload) {
    return apiClient.post('/v1/attendance', payload).then((res) => res.data);
  },
  update(id, payload) {
    return apiClient.put(`/v1/attendance/${id}`, payload).then((res) => res.data);
  },
  remove(id) {
    return apiClient.delete(`/v1/attendance/${id}`).then((res) => res.data);
  },
};
