import apiClient from '../lib/api';

// TODO: Implement event service API calls
export const eventService = {
  getAllEvents: async () => {
    // return apiClient.get('/api/events');
  },
  getEventById: async (id: string) => {
    // return apiClient.get(`/api/events/${id}`);
  },
  createEvent: async (data: any) => {
    // return apiClient.post('/api/events', data);
  },
  updateEvent: async (id: string, data: any) => {
    // return apiClient.put(`/api/events/${id}`, data);
  },
  deleteEvent: async (id: string) => {
    // return apiClient.delete(`/api/events/${id}`);
  },
};
