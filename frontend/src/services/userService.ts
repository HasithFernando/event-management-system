import apiClient from '../lib/api';

// TODO: Implement user service API calls
export const userService = {
  getAllUsers: async () => {
    // return apiClient.get('/api/users');
  },
  getUserById: async (id: string) => {
    // return apiClient.get(`/api/users/${id}`);
  },
  createUser: async (data: any) => {
    // return apiClient.post('/api/users', data);
  },
  updateUser: async (id: string, data: any) => {
    // return apiClient.put(`/api/users/${id}`, data);
  },
  deleteUser: async (id: string) => {
    // return apiClient.delete(`/api/users/${id}`);
  },
};
