'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

export default function DashboardPage() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated) {
                router.push('/auth/login');
            } else if (user) {
                // Redirect based on user role
                if (user.role === 'ORGANIZER' || user.role === 'ADMIN') {
                    router.push('/dashboard/organizer');
                } else {
                    router.push('/dashboard/attendee');
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, user, authLoading]);

    if (authLoading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="spinner w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return null;
}
