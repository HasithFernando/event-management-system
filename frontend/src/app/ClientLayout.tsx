'use client';

import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { usePathname } from 'next/navigation';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, user } = useAuth();
    const pathname = usePathname();

    const isAuthPage = pathname?.startsWith('/auth');
    const isOrganizer = user?.role === 'ORGANIZER' || user?.role === 'ADMIN';

    if (isAuthenticated) {
        if (isOrganizer) {
            return (
                <>
                    <Navbar />
                    <div className="app-layout">
                        <Sidebar />
                        <main className="main-with-sidebar">
                            {children}
                        </main>
                    </div>
                </>
            );
        }

        // Attendee Layout - Full Width, No Sidebar
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-white">
                    {children}
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            {!isAuthPage && <Navbar />}
            {children}
            {!isAuthPage && <Footer />}
        </>
    );
}
