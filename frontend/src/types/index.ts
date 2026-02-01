// User Types
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'USER' | 'ORGANIZER' | 'ADMIN';
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  user: User;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

// Event Types
export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED' | 'SOLD_OUT';
export type EventCategory =
  | 'CONFERENCE' | 'WORKSHOP' | 'SEMINAR' | 'CONCERT'
  | 'SPORTS' | 'EXHIBITION' | 'NETWORKING' | 'PARTY'
  | 'CHARITY' | 'EDUCATION' | 'TECHNOLOGY' | 'BUSINESS'
  | 'ARTS' | 'FOOD' | 'HEALTH' | 'OTHER';

export interface Event {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  location: string;
  address?: string;
  capacity: number;
  availableSeats: number;
  price: number;
  category: EventCategory;
  organizerId: number;
  organizerName?: string;
  status: EventStatus;
  imageUrls: string[];
  thumbnailUrl?: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  location: string;
  address?: string;
  capacity: number;
  price: number;
  category: EventCategory;
  organizerId: number;
  organizerName?: string;
  imageUrls?: string[];
  thumbnailUrl?: string;
  featured?: boolean;
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  eventDate?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  address?: string;
  capacity?: number;
  price?: number;
  category?: EventCategory;
  status?: EventStatus;
  imageUrls?: string[];
  thumbnailUrl?: string;
  featured?: boolean;
}

// Booking Types
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'REFUNDED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface Booking {
  id: number;
  userId: number;
  eventId: number;
  numberOfTickets: number;
  totalAmount: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  bookingReference: string;
  eventTitle: string;
  eventLocation: string;
  eventDateTime: string;
  userEmail: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingRequest {
  userId: number;
  eventId: number;
  numberOfTickets: number;
}

// API Response Types
export interface ApiError {
  status: number;
  message: string;
  timestamp: string;
  path: string;
  errors?: Record<string, string>;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
