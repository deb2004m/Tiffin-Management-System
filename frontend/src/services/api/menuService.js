import { apiClient } from './index';

export const menuService = {
  list(params) {
    return apiClient.get('/v1/menus', { params }).then((res) => res.data);
  },
  getById(id) {
    return apiClient.get(`/v1/menus/${id}`).then((res) => res.data);
  },
  create(payload) {
    return apiClient.post('/v1/menus', payload).then((res) => res.data);
  },
  update(id, payload) {
    return apiClient.put(`/v1/menus/${id}`, payload).then((res) => res.data);
  },
  remove(id) {
    return apiClient.delete(`/v1/menus/${id}`).then((res) => res.data);
  },
};
