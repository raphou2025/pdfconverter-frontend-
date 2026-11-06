import api from './api';

export const adminService = {
  // Existing ones
  getStats: async () => {
    const res = await api.get('/admin/stats');
    return res.data;
  },
  getUsers: async (page = 1, pageSize = 20) => {
    const res = await api.get(`/admin/users?page=${page}&pageSize=${pageSize}`);
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