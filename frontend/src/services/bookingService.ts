import apiClient from '../lib/api';

// TODO: Implement booking service API calls
export const bookingService = {
  getAllBookings: async () => {
    // return apiClient.get('/api/bookings');
  },
  getBookingById: async (id: string) => {
    // return apiClient.get(`/api/bookings/${id}`);
  },
  createBooking: async (data: any) => {
    // return apiClient.post('/api/bookings', data);
  },
  updateBooking: async (id: string, data: any) => {
    // return apiClient.put(`/api/bookings/${id}`, data);
  },
  deleteBooking: async (id: string) => {
    // return apiClient.delete(`/api/bookings/${id}`);
  },
};
