import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { paymentApi, ticketApi, eventApi, type EventItem } from "../services/eventflow";
import { Loader2, ArrowLeft, CreditCard, CheckCircle, Minus, Plus, Ticket } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

export function Checkout() {
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [event, setEvent] = useState<EventItem | null>(null);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [soldTickets, setSoldTickets] = useState(0);
    const [userTickets, setUserTickets] = useState(0);

    useEffect(() => {
        const loadEvent = async () => {
            if (!eventId || !user) {
                navigate('/attendee/discover');
                return;
            }
            try {
                const events = await eventApi.list();
                const foundEvent = events.find(e => e.id === eventId);
                if (foundEvent) {
                    setEvent(foundEvent);
                    
                    // Fetch sold tickets for this event
                    const tickets = await ticketApi.list({ eventId });
                    setSoldTickets(tickets.length);
                    
                    // Fetch user's existing tickets for this event
                    const userEventTickets = tickets.filter(t => t.userId === user.id);
                    setUserTickets(userEventTickets.length);
                } else {
                    toast.error("Event not found");
                    navigate('/attendee/discover');
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to load event");
                navigate('/attendee/discover');
            } finally {
                setFetchLoading(false);
            }
        };

        loadEvent();
    }, [eventId, navigate, user]);

    if (fetchLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    if (!event) return null;

    const remainingTickets = event.maxTickets - soldTickets;
    const userCanPurchase = Math.min(3 - userTickets, remainingTickets);
    const totalPrice = event.price * quantity;

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity < 1 || newQuantity > userCanPurchase) return;
        setQuantity(newQuantity);
    };

    const handlePayment = async () => {
        if (!user) {
            toast.error("Please log in to continue");
            return;
        }

        if (quantity > userCanPurchase) {
            toast.error(`You can only purchase ${userCanPurchase} more ticket(s)`);
            return;
        }

        setLoading(true);
        try {
            const orderId = `ORDER-${Date.now()}`;
            const amount = totalPrice;
            const currency = "LKR";

            // 1. Call payment service to log the payment attempt (for university project tracking)
            await paymentApi.initiate({
                orderId,
                amount,
                currency
            });

            // 2. Simulate payment processing delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // 3. Create the tickets
            const purchasedTickets = await ticketApi.purchase({ 
                eventId: event.id, 
                userId: user.id, 
                price: event.price,
                quantity: quantity
            });

            console.log(`Successfully created ${purchasedTickets.length} ticket(s):`, purchasedTickets);

            // 4. Show success state
            setShowConfirmation(true);
            const ticketText = quantity === 1 ? "ticket" : "tickets";
            const message = quantity === 1 
                ? `Payment successful! Your ticket has been created.` 
                : `Payment successful! ${quantity} tickets have been created.`;
            toast.success(message);

            // 5. Redirect after a moment
            setTimeout(() => {
                navigate('/attendee/tickets');
            }, 2500);

        } catch (error: any) {
            console.error(error);
            const errorMessage = error?.message || "Failed to process payment";
            toast.error(errorMessage);
            setLoading(false);
        }
    };

    if (showConfirmation) {
        const ticketText = quantity === 1 ? "ticket" : "tickets";
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100 text-center">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                            <CheckCircle className="h-10 w-10 text-green-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Successful!</h3>
                        <p className="text-sm text-gray-600 mb-2">You've purchased <span className="font-bold text-indigo-600">{quantity} {ticketText}</span> for {event.title}</p>
                        <p className="text-xs text-gray-500 mb-4">Each ticket will have a unique QR code for event entry</p>
                        <p className="text-xs text-gray-400">Redirecting to your tickets...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                    Checkout
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Complete your ticket purchase
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
                    <div className="space-y-6">
                        {/* Event Image */}
                        {event.imageUrl && (
                            <div className="w-full h-40 rounded-lg overflow-hidden">
                                <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                            </div>
                        )}

                        <div>
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Event Details</h3>
                            <div className="mt-4 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Event:</span>
                                    <span className="font-medium text-gray-900 text-right">{event.title}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Category:</span>
                                    <span className="font-medium text-gray-900">{event.category}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Date:</span>
                                    <span className="font-medium text-gray-900">{event.date}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Time:</span>
                                    <span className="font-medium text-gray-900">{event.time}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Location:</span>
                                    <span className="font-medium text-gray-900 text-right">{event.location}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Remaining Seats:</span>
                                    <span className={`font-medium ${remainingTickets < 10 ? 'text-red-600' : 'text-green-600'}`}>
                                        {remainingTickets} / {event.maxTickets}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {userTickets > 0 && (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                <div className="flex items-start">
                                    <Ticket className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                                    <div className="text-sm text-amber-800">
                                        <p className="font-medium mb-1">You already have {userTickets} {userTickets === 1 ? 'ticket' : 'tickets'} for this event</p>
                                        <p className="text-xs text-amber-600">You can purchase up to {userCanPurchase} more {userCanPurchase === 1 ? 'ticket' : 'tickets'} (max 3 per event)</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-3">Quantity</h3>
                            <p className="text-xs text-gray-500 mb-3">Each ticket will have a unique QR code</p>
                            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <button
                                    onClick={() => handleQuantityChange(quantity - 1)}
                                    disabled={quantity <= 1}
                                    className="w-10 h-10 rounded-lg bg-white border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">{quantity}</div>
                                    <div className="text-xs text-gray-500">
                                        {quantity === 1 ? 'ticket' : 'tickets'}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleQuantityChange(quantity + 1)}
                                    disabled={quantity >= userCanPurchase}
                                    className="w-10 h-10 rounded-lg bg-white border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            {userCanPurchase === 0 && (
                                <p className="text-xs text-red-600 mt-2 text-center">
                                    {userTickets >= 3 ? "You've reached the maximum of 3 tickets for this event" : "No tickets available"}
                                </p>
                            )}
                            {quantity > 1 && (
                                <p className="text-xs text-indigo-600 mt-2 text-center font-medium">
                                    You'll receive {quantity} separate tickets with individual QR codes
                                </p>
                            )}
                        </div>

                        <div>
                            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-3">Payment Summary</h3>
                            <div className="space-y-2 bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Price per ticket:</span>
                                    <span className="text-gray-900">LKR {event.price.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Quantity:</span>
                                    <span className="text-gray-900">× {quantity}</span>
                                </div>
                                <div className="border-t border-gray-300 pt-2 mt-2">
                                    <div className="flex justify-between text-base">
                                        <span className="font-medium text-gray-900">Total Amount:</span>
                                        <span className="font-bold text-indigo-600">LKR {totalPrice.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <CreditCard className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                                <div className="text-sm text-blue-800">
                                    <p className="font-medium mb-1">Mock Payment</p>
                                    <p className="text-xs text-blue-600">This is a simulated payment. No actual transaction will occur.</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                            <button
                                onClick={handlePayment}
                                disabled={loading || userCanPurchase === 0}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                        Processing Payment...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="-ml-1 mr-2 h-4 w-4" />
                                        Pay LKR {totalPrice.toLocaleString()}
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="text-center">
                            <button
                                onClick={() => navigate(-1)}
                                disabled={loading}
                                className="text-sm text-gray-500 hover:text-gray-900 flex items-center justify-center w-full disabled:opacity-50 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4 mr-1" /> Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
