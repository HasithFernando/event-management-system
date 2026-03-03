import { eventApi, ticketApi, type EventItem, type TicketItem } from "../services/eventflow";
import { Calendar, MapPin, Ticket, CheckCircle, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

type TicketWithEvent = TicketItem & { event: EventItem };

export function MyTickets() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [myTickets, setMyTickets] = useState<TicketWithEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    
    const loadTickets = async () => {
      try {
        setLoading(true);
        const [eventsData, ticketsData] = await Promise.all([
          eventApi.list(),
          ticketApi.list({ userId: user.id }),
        ]);

        // Create a map for quick event lookup
        const eventMap = new Map(eventsData.map(e => [e.id, e]));

        // Map each ticket to include its event details
        const ticketsWithEvents: TicketWithEvent[] = ticketsData
          .map(ticket => {
            const event = eventMap.get(ticket.eventId);
            return event ? { ...ticket, event } : null;
          })
          .filter((t): t is TicketWithEvent => t !== null);

        setMyTickets(ticketsWithEvents);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load tickets");
      } finally {
        setLoading(false);
      }
    };

    void loadTickets();
  }, [user?.id]);

  const handleDownload = async (ticketId: string, eventTitle: string) => {
    setDownloadingId(ticketId);
    try {
      await ticketApi.download(ticketId);
      toast.success(`Ticket for "${eventTitle}" downloaded!`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to download ticket. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  // Group tickets by event for display
  const ticketsByEvent = myTickets.reduce((acc, ticket) => {
    const eventId = ticket.eventId;
    if (!acc[eventId]) {
      acc[eventId] = [];
    }
    acc[eventId].push(ticket);
    return acc;
  }, {} as Record<string, TicketWithEvent[]>);

  const totalTicketCount = myTickets.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Tickets</h2>
          <p className="text-sm text-gray-500 mt-1">View and manage your purchased tickets</p>
        </div>
        <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-sm font-semibold rounded-lg">
          {totalTicketCount} {totalTicketCount === 1 ? 'ticket' : 'tickets'}
        </span>
      </div>
      
      {totalTicketCount === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 border-dashed">
          <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No tickets yet</h3>
          <p className="text-gray-500 mt-2 mb-6">Browse events and book your first experience!</p>
          <button 
            onClick={() => navigate('/attendee')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Browse Events
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(ticketsByEvent).map(([eventId, tickets]) => {
            const event = tickets[0].event;
            const ticketCount = tickets.length;
            
            return (
              <div key={eventId} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Event Header */}
                <div className="flex flex-col sm:flex-row gap-4 p-4 md:p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
                  <div className="w-full sm:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={event.imageUrl || ""} alt={event.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium">
                          {event.category}
                        </span>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wide flex items-center whitespace-nowrap">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {ticketCount} {ticketCount === 1 ? 'Ticket' : 'Tickets'}
                      </span>
                    </div>
                    
                    <div className="space-y-1.5 mt-3">
                      <div className="flex items-center text-gray-600 text-sm">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {event.date} at {event.time}
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Individual Tickets */}
                <div className="p-4 md:p-6 space-y-3">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-700">Your Tickets:</h4>
                    {ticketCount > 1 && (
                      <span className="text-xs text-gray-500">Each ticket has a unique QR code</span>
                    )}
                  </div>
                  {tickets.map((ticket, index) => (
                    <div key={ticket.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <Ticket className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Ticket #{index + 1}</p>
                          <p className="text-xs text-gray-500">ID: {ticket.id.slice(0, 8)}...</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Purchased: {new Date(ticket.purchasedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownload(ticket.id, event.title)}
                        disabled={downloadingId === ticket.id}
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {downloadingId === ticket.id ? (
                          <>
                            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Downloading...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Download QR
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
