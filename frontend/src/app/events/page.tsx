'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { eventService } from '../../services/eventService';
import { Event } from '../../types';
import EventCard from '../../components/EventCard';

export default function EventsPage() {
    const { isAuthenticated } = useAuth();
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setIsLoading(true);
            // Fetch upcoming events by default for better UX
            const data = await eventService.getUpcomingEvents();
            setEvents(data);
        } catch (err) {
            console.error('Failed to fetch events:', err);
            setError('Failed to load events. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="section">
            <div className="flex justify-between items-end section-header">
                <div>
                    <h1 className="section-title">Explore Events</h1>
                    <p className="section-subtitle">Discover and book upcoming events</p>
                </div>

                {isAuthenticated && (
                    <Link href="/events/create">
                        <button className="btn btn-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Create Event
                        </button>
                    </Link>
                )}
            </div>

            {error && (
                <div className="alert alert-error mb-8">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="grid grid-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="skeleton h-[400px]"></div>
                    ))}
                </div>
            ) : events.length > 0 ? (
                <div className="grid grid-3">
                    {events.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
                    <div className="mb-4 text-gray-400">
                        <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Upcoming Events</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">There are currently no upcoming events scheduled. Be the first to host one!</p>
                    {isAuthenticated ? (
                        <Link href="/events/create">
                            <button className="btn btn-primary">Create Event</button>
                        </Link>
                    ) : (
                        <Link href="/auth/login">
                            <button className="btn btn-primary">Log in to Create</button>
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
