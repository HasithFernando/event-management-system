'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Event } from '../../../types';
import { eventService } from '../../../services/eventService';
import { bookingService } from '../../../services/bookingService';
import { useAuth } from '../../../contexts/AuthContext';
import { getErrorMessage } from '../../../lib/api';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const id = parseInt(params.id as string);
        const data = await eventService.getEventById(id);
        setEvent(data);
      } catch (error) {
        console.error('Failed to fetch event:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvent();
  }, [params.id]);

  const handleBooking = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (!event || !user) return;

    setIsBooking(true);
    setBookingError('');
    setBookingSuccess('');

    try {
      const booking = await bookingService.createBooking({
        userId: user.id,
        eventId: event.id,
        numberOfTickets,
      });
      setBookingSuccess(`Booking confirmed! Reference: ${booking.bookingReference}`);
      // Refresh event to get updated available seats
      const updatedEvent = await eventService.getEventById(event.id);
      setEvent(updatedEvent);
    } catch (error) {
      setBookingError(getErrorMessage(error));
    } finally {
      setIsBooking(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Event not found</h1>
        <Link href="/events" className="mt-4 text-indigo-600 hover:text-indigo-500">
          Back to events
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/events" className="text-indigo-600 hover:text-indigo-500 mb-4 inline-block">
        ← Back to events
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {event.thumbnailUrl ? (
            <img
              src={event.thumbnailUrl}
              alt={event.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-96 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-6xl">{event.category.charAt(0)}</span>
            </div>
          )}

          <div className="mt-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded">
                {event.category}
              </span>
              <span
                className={`text-sm font-medium px-3 py-1 rounded ${event.status === 'PUBLISHED'
                    ? 'bg-green-100 text-green-800'
                    : event.status === 'SOLD_OUT'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
              >
                {event.status}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>

            <div className="prose max-w-none">
              <p className="text-gray-600 whitespace-pre-wrap">{event.description}</p>
            </div>

            {event.organizerName && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Organized by</h3>
                <p className="text-lg font-medium text-gray-900">{event.organizerName}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <div className="text-3xl font-bold text-indigo-600 mb-4">
              ${event.price.toFixed(2)}
              <span className="text-sm font-normal text-gray-500"> / ticket</span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(event.eventDate)}
              </div>
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatTime(event.startTime)} - {formatTime(event.endTime)}
              </div>
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {event.location}
              </div>
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {event.availableSeats} of {event.capacity} seats available
              </div>
            </div>

            {event.status === 'PUBLISHED' && event.availableSeats > 0 && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of tickets
                  </label>
                  <select
                    value={numberOfTickets}
                    onChange={(e) => setNumberOfTickets(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {Array.from({ length: Math.min(10, event.availableSeats) }, (_, i) => i + 1).map(
                      (num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'ticket' : 'tickets'}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="mb-4 p-3 bg-gray-50 rounded-md">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({numberOfTickets} tickets)</span>
                    <span className="font-medium">
                      ${(event.price * numberOfTickets).toFixed(2)}
                    </span>
                  </div>
                </div>

                {bookingError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                    {bookingError}
                  </div>
                )}

                {bookingSuccess && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-md text-sm">
                    {bookingSuccess}
                    <Link href="/my-tickets" className="block mt-2 text-green-700 underline">
                      View my bookings
                    </Link>
                  </div>
                )}

                <button
                  onClick={handleBooking}
                  disabled={isBooking}
                  className="w-full py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isBooking ? 'Processing...' : 'Book Now'}
                </button>
              </>
            )}

            {event.status === 'SOLD_OUT' && (
              <div className="text-center py-4 bg-red-50 rounded-md text-red-600">
                This event is sold out
              </div>
            )}

            {event.status === 'CANCELLED' && (
              <div className="text-center py-4 bg-gray-50 rounded-md text-gray-600">
                This event has been cancelled
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
