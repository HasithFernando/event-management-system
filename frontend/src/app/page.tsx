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
    <main className="animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <h1>Discover Amazing Events ✨</h1>
        <p>
          Find and book tickets for the best events in your area
        </p>
        <div className="btn-group">
          <Link href="/events" className="btn btn-primary">
            <span>🎫</span> Browse Events
          </Link>
          <Link href="/auth/register" className="btn btn-secondary">
            <span>🚀</span> Get Started
          </Link>
        </div>
      </section>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">⭐ Featured Events</h2>
            <Link href="/events?featured=true" className="gradient-text font-semibold">
              View all →
            </Link>
          </div>
          <div className="grid grid-3">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">🎪 Upcoming Events</h2>
          <Link href="/events" className="gradient-text font-semibold">
            View all →
          </Link>
        </div>
        {isLoading ? (
          <div className="flex-center" style={{ padding: '3rem' }}>
            <div className="spinner"></div>
          </div>
        ) : upcomingEvents.length > 0 ? (
          <div className="grid grid-3">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="card text-center">
            <h3>📅 No upcoming events found</h3>
            <p className="mt-md mb-lg">Be the first to create an amazing event!</p>
            <Link href="/events/create" className="btn btn-primary">
              Create the first event →
            </Link>
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="section">
        <div className="section-header text-center">
          <h2 className="section-title">🎨 Browse by Category</h2>
          <p className="section-subtitle">Discover events that match your interests</p>
        </div>
        <div className="category-list">
          {[{ name: 'CONFERENCE', icon: '🎤' }, { name: 'WORKSHOP', icon: '🛠️' }, { name: 'CONCERT', icon: '🎵' }, { name: 'SPORTS', icon: '⚽' }, { name: 'TECHNOLOGY', icon: '💻' }, { name: 'ARTS', icon: '🎨' }].map(
            ({ name, icon }) => (
              <Link
                key={name}
                href={`/events?category=${name}`}
                className="category-badge"
              >
                <span>{icon} {name}</span>
              </Link>
            )
          )}
        </div>
      </section>
    </main>
  );
}
