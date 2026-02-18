import { CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ticketApi } from "../api/eventflow";

interface PaymentSuccessProps {
    onHome: () => void;
}

export function PaymentSuccess({ onHome }: PaymentSuccessProps) {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verifying payment...');

    useEffect(() => {
        const createTicket = async () => {
            const pendingPurchase = localStorage.getItem('pending_purchase');

            if (!pendingPurchase) {
                setStatus('error');
                setMessage('No pending purchase found.');
                return;
            }

            try {
                const { eventId, price, title } = JSON.parse(pendingPurchase);
                const userStr = localStorage.getItem('user');

                if (!userStr) {
                    setStatus('error');
                    setMessage('User session not found. Please login again.');
                    return;
                }

                const user = JSON.parse(userStr);

                // Call backend to create ticket
                await ticketApi.purchase({
                    eventId,
                    attendeeId: user.id,
                    price
                });

                setStatus('success');
                localStorage.removeItem('pending_purchase'); // Clear pending purchase

            } catch (error) {
                console.error(error);
                setStatus('error');
                setMessage('Failed to create ticket. Please contact support.');
            }
        };

        createTicket();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center">

                {status === 'loading' && (
                    <div className="flex flex-col items-center">
                        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                        <h2 className="text-xl font-bold text-gray-900">Processing...</h2>
                        <p className="text-gray-500 mt-2">{message}</p>
                    </div>
                )}

                {status === 'success' && (
                    <>
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ticket Available!</h2>
                        <p className="text-gray-600 mb-8">
                            Your payment was successful and your ticket has been booked. You will receive a confirmation email shortly.
                        </p>
                        <button
                            onClick={onHome}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Home
                        </button>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                            <span className="text-3xl">⚠️</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
                        <p className="text-red-500 mb-8">{message}</p>
                        <button
                            onClick={onHome}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Home
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
