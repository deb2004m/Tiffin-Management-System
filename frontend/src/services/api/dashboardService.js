import { apiClient } from './index';

export const dashboardService = {
  stats() {
    return apiClient.get('/v1/dashboard/stats').then((res) => res.data);
  },
};
