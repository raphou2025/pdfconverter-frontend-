import api from './api';

export const adminService = {
  // Existing ones
  getStats: async () => {
    const res = await api.get('/admin/stats');
    return res.data;
  },
  getUsers: async (page = 1, pageSize = 20, search = '', role = 'ALL') => {
    const params = new URLSearchParams({ page, pageSize, search, role });
    const res = await api.get(`/admin/users?${params}`);
    return res.data;
  },
  
  // 🚨 NEW: Add these two functions
  updateUserRole: async (userId, role) => {
    const res = await api.put(`/admin/users/${userId}/role`, { role });
    return res.data;
  },
  deleteUser: async (userId) => {
    const res = await api.delete(`/admin/users/${userId}`);
    return res.data;
  }
};