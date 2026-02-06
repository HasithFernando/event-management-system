'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  // If user is Attendee, show the specific Attendee Navbar
  if (isAuthenticated && user?.role !== 'ORGANIZER' && user?.role !== 'ADMIN') {
    return (
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 h-[64px] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
          {/* Left: Brand */}
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 rounded-lg p-1.5">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">EventFlow</span>
          </div>

          {/* Center: Navigation */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
            <Link
              href="/dashboard/attendee"
              className={`text-sm font-medium transition-all relative py-5 ${pathname === '/dashboard/attendee'
                  ? 'text-indigo-600'
                  : 'text-gray-500 hover:text-gray-900'
                }`}
            >
              Discover
              {pathname === '/dashboard/attendee' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>
              )}
            </Link>
            <Link
              href="/my-tickets"
              className={`text-sm font-medium transition-all relative py-5 ${pathname === '/my-tickets'
                  ? 'text-indigo-600'
                  : 'text-gray-500 hover:text-gray-900'
                }`}
            >
              My Tickets
              {pathname === '/my-tickets' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></span>
              )}
            </Link>
          </div>

          {/* Right: User Profile */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Happy Attendee'}
              </span>
              <button
                onClick={() => logout()}
                className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
                title="Sign Out"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Default Navbar for others (Landing / Guest) - keeping simplistic version or original
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 h-[64px] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-indigo-600 rounded-lg p-1.5">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">EventFlow</span>
        </Link>
        <div className="flex items-center gap-4">
          {!isAuthenticated && (
            <>
              <Link href="/auth/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">Sign In</Link>
              <Link href="/auth/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">Get Started</Link>
            </>
          )}
          {isAuthenticated && (user?.role === 'ORGANIZER' || user?.role === 'ADMIN') && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Organizer Mode</span>
              <button onClick={logout} className="text-sm font-medium text-gray-600 hover:text-red-600">Sign Out</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
