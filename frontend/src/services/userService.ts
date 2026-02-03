import apiClient from '../lib/api';
import { User, RegisterRequest, LoginRequest, AuthResponse, UpdateUserRequest } from '../types';

export const userService = {
  // Auth endpoints
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/users/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/users/auth/login', data);
    return response.data;
  },

  googleLogin: async (token: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/users/auth/google/login', { token });
    return response.data;
  },

  googleRegister: async (token: string, role?: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/users/auth/google/register', { token, role });
    return response.data;
  },

  // User CRUD endpoints
  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/users');
    return response.data;
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },

  getUserByEmail: async (email: string): Promise<User> => {
    const response = await apiClient.get<User>(`/users/email/${email}`);
    return response.data;
  },

  updateUser: async (id: number, data: UpdateUserRequest): Promise<User> => {
    const response = await apiClient.put<User>(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },

  // Search
  searchUsers: async (query: string): Promise<User[]> => {
    const response = await apiClient.get<User[]>(`/users/search?query=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Utility
  userExists: async (id: number): Promise<boolean> => {
    const response = await apiClient.get<boolean>(`/users/${id}/exists`);
    return response.data;
  },
};
