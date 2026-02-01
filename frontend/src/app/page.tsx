'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Event } from '../types';
import { eventService } from '../services/eventService';
import EventCard from '../components/EventCard';

export default function Home() {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const [featured, upcoming] = await Promise.all([
          eventService.getFeaturedEvents(),
          eventService.getUpcomingEvents(),
        ]);
        setFeaturedEvents(featured.slice(0, 3));
        setUpcomingEvents(upcoming.slice(0, 6));
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Amazing Events
          </h1>
          <p className="text-xl mb-8 text-indigo-100">
            Find and book tickets for the best events in your area
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/events"
              className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors"
            >
              Browse Events
            </Link>
            <Link
              href="/auth/register"
              className="px-8 py-3 bg-indigo-500 text-white font-semibold rounded-lg border border-white hover:bg-indigo-400 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Featured Events</h2>
              <Link
                href="/events?featured=true"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Upcoming Events</h2>
            <Link
              href="/events"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View all →
            </Link>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No upcoming events found.</p>
              <Link
                href="/events/create"
                className="mt-4 inline-block text-indigo-600 hover:text-indigo-700"
              >
                Create the first event →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['CONFERENCE', 'WORKSHOP', 'CONCERT', 'SPORTS', 'TECHNOLOGY', 'ARTS'].map(
              (category) => (
                <Link
                  key={category}
                  href={`/events?category=${category}`}
                  className="p-4 bg-gray-50 rounded-lg text-center hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  <span className="text-sm font-medium">{category}</span>
                </Link>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
