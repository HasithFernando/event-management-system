import apiClient from '../lib/api';
import { Event, CreateEventRequest, UpdateEventRequest, EventCategory, PaginatedResponse } from '../types';

export const eventService = {
  // CRUD endpoints
  getAllEvents: async (): Promise<Event[]> => {
    const response = await apiClient.get<Event[]>('/events');
    return response.data;
  },

  getEventById: async (id: number): Promise<Event> => {
    const response = await apiClient.get<Event>(`/events/${id}`);
    return response.data;
  },

  createEvent: async (data: CreateEventRequest): Promise<Event> => {
    const response = await apiClient.post<Event>('/events', data);
    return response.data;
  },

  updateEvent: async (id: number, data: UpdateEventRequest): Promise<Event> => {
    const response = await apiClient.put<Event>(`/events/${id}`, data);
    return response.data;
  },

  deleteEvent: async (id: number): Promise<void> => {
    await apiClient.delete(`/events/${id}`);
  },

  // Query endpoints
  getPublishedEvents: async (): Promise<Event[]> => {
    const response = await apiClient.get<Event[]>('/events/published');
    return response.data;
  },

  getUpcomingEvents: async (): Promise<Event[]> => {
    const response = await apiClient.get<Event[]>('/events/upcoming');
    return response.data;
  },

  getFeaturedEvents: async (): Promise<Event[]> => {
    const response = await apiClient.get<Event[]>('/events/featured');
    return response.data;
  },

  getEventsByCategory: async (category: EventCategory): Promise<Event[]> => {
    const response = await apiClient.get<Event[]>(`/events/category/${category}`);
    return response.data;
  },

  getEventsByOrganizer: async (organizerId: number): Promise<Event[]> => {
    const response = await apiClient.get<Event[]>(`/events/organizer/${organizerId}`);
    return response.data;
  },

  searchEvents: async (query: string): Promise<Event[]> => {
    const response = await apiClient.get<Event[]>(`/events/search?query=${encodeURIComponent(query)}`);
    return response.data;
  },

  getEventsPaginated: async (page: number = 0, size: number = 10): Promise<PaginatedResponse<Event>> => {
    const response = await apiClient.get<PaginatedResponse<Event>>(`/events/paginated?page=${page}&size=${size}`);
    return response.data;
  },

  // Status management
  publishEvent: async (id: number): Promise<Event> => {
    const response = await apiClient.put<Event>(`/events/${id}/publish`);
    return response.data;
  },

  cancelEvent: async (id: number): Promise<Event> => {
    const response = await apiClient.put<Event>(`/events/${id}/cancel`);
    return response.data;
  },

  // Utility
  eventExists: async (id: number): Promise<boolean> => {
    const response = await apiClient.get<boolean>(`/events/${id}/exists`);
    return response.data;
  },

  hasAvailableSeats: async (id: number, numberOfSeats: number): Promise<boolean> => {
    const response = await apiClient.get<boolean>(`/events/${id}/available-seats?numberOfSeats=${numberOfSeats}`);
    return response.data;
  },
};
