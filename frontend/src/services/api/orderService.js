import { apiClient } from './index';

export const orderService = {
  list() {
    return apiClient.get('/v1/orders').then((res) => res.data);
  },
  getById(id) {
    return apiClient.get(`/v1/orders/${id}`).then((res) => res.data);
  },
  place(payload) {
    return apiClient.post('/v1/orders', payload).then((res) => res.data);
  },
  updateStatus(id, payload) {
    return apiClient.patch(`/v1/orders/${id}/status`, payload).then((res) => res.data);
  },
  cancel(id) {
    return apiClient.post(`/v1/orders/${id}/cancel`).then((res) => res.data);
  },
};
