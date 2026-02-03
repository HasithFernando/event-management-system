'use client';

import Link from 'next/link';

export default function SavedEventsPage() {
    return (
        <div className="section text-center py-20">
            <span className="text-6xl block mb-4">💾</span>
            <h1 className="section-title">Saved Events</h1>
            <p className="section-subtitle max-w-md mx-auto mb-8">
                This feature is coming soon! You will be able to save events you are interested in and view them here.
            </p>
            <Link href="/events" className="btn btn-primary">
                Browse Events
            </Link>
        </div>
    );
}
