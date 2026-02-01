'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav>
      {/* The nav > div rule in globals.css handles the flex container and space-between alignment */}
      <div>
        {/* Left Side: Brand/Logo */}
        <Link href="/" className="hover-lift" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <span style={{ fontSize: '1.75rem' }}>🎫</span>
          <h1 style={{
            fontSize: '1.75rem',
            margin: 0,
            background: 'linear-gradient(135deg, var(--primary-600), var(--accent-600))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            EventHub
          </h1>
        </Link>

        {/* Right Side: Login or User Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <>
              <Link
                href="/profile"
                className="hover-lift"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  textDecoration: 'none',
                  color: 'var(--text-secondary)',
                  fontWeight: 600
                }}
              >
                <span>👤</span>
                <span className="hidden sm:inline">{user?.firstName}</span>
              </Link>
              <button
                onClick={logout}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 1.25rem' }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/auth/login" className="btn btn-primary">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
