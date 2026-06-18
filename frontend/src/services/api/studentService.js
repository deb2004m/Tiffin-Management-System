import { apiClient } from './index';

export const studentService = {
  search(params) {
    return apiClient.get('/v1/students', { params }).then((res) => res.data);
  },
  getMine() {
    return apiClient.get('/v1/students/me').then((res) => res.data);
  },
  getById(id) {
    return apiClient.get(`/v1/students/${id}`).then((res) => res.data);
  },
  create(payload) {
    return apiClient.post('/v1/students', payload).then((res) => res.data);
  },
  update(id, payload) {
    return apiClient.put(`/v1/students/${id}`, payload).then((res) => res.data);
  },
  remove(id) {
    return apiClient.delete(`/v1/students/${id}`).then((res) => res.data);
  },
  uploadAadhaar(id, file) {
    const form = new FormData();
    form.append('file', file);
    return apiClient
      .post(`/v1/students/${id}/aadhaar`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => res.data);
  },
};
