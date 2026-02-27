import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { eventApi, ticketApi, type EventItem, type TicketItem } from "../services/eventflow";
import { Calendar, MapPin, Users, DollarSign, ArrowLeft, User, Mail } from "lucide-react";
import { toast } from "sonner";

export function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEventDetail = async () => {
      if (!id) return;
      
      try {
        const [eventData, ticketsData] = await Promise.all([
          eventApi.list(),
          ticketApi.list({ eventId: id }),
        ]);
        
        const selectedEvent = eventData.find(e => e.id === id);
        if (selectedEvent) {
          setEvent(selectedEvent);
          setTickets(ticketsData);
        } else {
          toast.error("Event not found");
          navigate('/dashboard/events');
        }
      } catch (error) {
        console.error("Failed to load event details:", error);
        toast.error("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    loadEventDetail();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard/events')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Details</h1>
          <p className="text-gray-500 mt-1">View and manage event information</p>
        </div>
      </div>

      {/* Event Information */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="relative h-64 md:h-80">
          <img 
            src={event.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87"} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium border border-white/30">
                {event.category}
              </span>
              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                event.status === 'Upcoming' ? 'bg-green-500' : 'bg-gray-500'
              }`}>
                {event.status}
              </span>
            </div>
            <h2 className="text-3xl font-bold">{event.title}</h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
              <div className="flex items-center gap-2 text-indigo-700 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-medium">Date & Time</span>
              </div>
              <p className="font-bold text-gray-900">{event.date}</p>
              <p className="text-sm text-gray-600">{event.time}</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center gap-2 text-green-700 mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-xs font-medium">Location</span>
              </div>
              <p className="font-bold text-gray-900 text-sm line-clamp-2">{event.location}</p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
              <div className="flex items-center gap-2 text-purple-700 mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs font-medium">Ticket Price</span>
              </div>
              <p className="font-bold text-gray-900">${event.price}</p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2 text-blue-700 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-xs font-medium">Tickets Sold</span>
              </div>
              <p className="font-bold text-gray-900">{tickets.length}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">{event.description}</p>
          </div>

          {/* Tickets List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Ticket Purchases</h3>
              <span className="text-sm text-gray-500">{tickets.length} sold</span>
            </div>
            
            {tickets.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No tickets sold yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">Ticket #{ticket.id.slice(0, 8)}</h4>
                        <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                          <DollarSign className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>${ticket.price}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          Purchased: {new Date(ticket.purchasedAt).toLocaleDateString()}
                        </p>
                        <div className="mt-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            ticket.status === 'Confirmed' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {ticket.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
