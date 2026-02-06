'use client';

import Link from 'next/link';
import { Event } from '../types';

interface EventCardProps {
  event: Event;
  purchased?: boolean;
}

export default function EventCard({ event, purchased = false }: EventCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      <div className="relative h-48 overflow-hidden shrink-0">
        {/* Image */}
        {event.thumbnailUrl ? (
          <img
            src={event.thumbnailUrl}
            alt={event.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-5xl font-bold opacity-30">{event.category.charAt(0)}</span>
          </div>
        )}

        {/* Price Badge - Top Left */}
        <div className="absolute top-4 left-4">
          <span className="bg-white/95 backdrop-blur-sm text-gray-900 text-sm font-bold px-3 py-1.5 rounded-lg shadow-sm">
            ${event.price}
          </span>
        </div>

        {/* Heart Icon - Top Right */}
        <button className="absolute top-4 right-4 w-8 h-8 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white transition-colors shadow-sm">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        {/* Category Pill */}
        <div className="mb-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide
                ${event.category === 'TECHNOLOGY' ? 'bg-indigo-100 text-indigo-700' :
              event.category === 'CONCERT' ? 'bg-purple-100 text-purple-700' :
                event.category === 'BUSINESS' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'}`}>
            {event.category}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {event.title}
        </h3>

        <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
          {event.description}
        </p>

        <div className="flex flex-col gap-2 pt-4 border-t border-gray-50 mt-auto">
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(event.eventDate)} • {formatTime(event.startTime)}
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-5">
          {purchased ? (
            <button disabled className="block w-full text-center py-2.5 rounded-lg bg-green-50 text-green-700 font-semibold border border-green-200 cursor-default">
              Ticket Purchased
            </button>
          ) : event.status === 'PUBLISHED' ? (
            <Link href={`/events/${event.id}`} className="block w-full text-center py-2.5 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
              Get Tickets
            </Link>
          ) : (
            <div className="block w-full text-center py-2.5 rounded-lg bg-gray-50 text-gray-500 font-medium cursor-not-allowed">
              {event.status === 'SOLD_OUT' ? 'Sold Out' : 'Unavailable'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
