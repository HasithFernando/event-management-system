'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';

export function GoogleWrapper({ children }: { children: React.ReactNode }) {
    // Use environment variable or default to a placeholder
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';

    return (
        <GoogleOAuthProvider clientId={clientId}>
            {children}
        </GoogleOAuthProvider>
    );
}
