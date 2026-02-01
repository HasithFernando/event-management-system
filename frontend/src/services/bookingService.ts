import apiClient from '../lib/api';
import { Booking, CreateBookingRequest } from '../types';

export const bookingService = {
  // CRUD endpoints
  getAllBookings: async (): Promise<Booking[]> => {
    const response = await apiClient.get<Booking[]>('/bookings');
    return response.data;
  },

  getBookingById: async (id: number): Promise<Booking> => {
    const response = await apiClient.get<Booking>(`/bookings/${id}`);
    return response.data;
  },

  getBookingByReference: async (reference: string): Promise<Booking> => {
    const response = await apiClient.get<Booking>(`/bookings/reference/${reference}`);
    return response.data;
  },

  createBooking: async (data: CreateBookingRequest): Promise<Booking> => {
    const response = await apiClient.post<Booking>('/bookings', data);
    return response.data;
  },

  deleteBooking: async (id: number): Promise<void> => {
    await apiClient.delete(`/bookings/${id}`);
  },

  // Query endpoints
  getBookingsByUser: async (userId: number): Promise<Booking[]> => {
    const response = await apiClient.get<Booking[]>(`/bookings/user/${userId}`);
    return response.data;
  },

  getBookingsByEvent: async (eventId: number): Promise<Booking[]> => {
    const response = await apiClient.get<Booking[]>(`/bookings/event/${eventId}`);
    return response.data;
  },

  // Status management
  confirmPayment: async (id: number): Promise<Booking> => {
    const response = await apiClient.put<Booking>(`/bookings/${id}/confirm-payment`);
    return response.data;
  },

  cancelBooking: async (id: number): Promise<Booking> => {
    const response = await apiClient.put<Booking>(`/bookings/${id}/cancel`);
    return response.data;
  },

  // Analytics
  getEventRevenue: async (eventId: number): Promise<number> => {
    const response = await apiClient.get<number>(`/bookings/event/${eventId}/revenue`);
    return response.data;
  },

  getEventBookingsCount: async (eventId: number): Promise<number> => {
    const response = await apiClient.get<number>(`/bookings/event/${eventId}/count`);
    return response.data;
  },
};
