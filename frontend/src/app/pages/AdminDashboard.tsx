import { useEffect, useState } from "react";
import {
  adminApi, feedbackApi,
  type DashboardStats, type EventItem, type UserResponse,
  type FeedbackItem, type FeedbackStatus,
} from "../services/eventflow";
import {
  Calendar, Users, Ticket, TrendingUp,
  Edit, Trash2, Ban, UserX, CheckCircle,
  Search, Filter, MoreVertical, X, Save,
  AlertCircle, CheckCircle2, MessageSquare, Star
} from "lucide-react";
import { toast } from "sonner";
import clsx from "clsx";
import { NotificationBell } from "../components/NotificationBell";
import { BroadcastMessageForm } from "../components/BroadcastMessageForm";

type TabType = "overview" | "events" | "users" | "feedback";

const FEEDBACK_STATUS_STYLES: Record<string, string> = {
  OPEN: "bg-blue-50 text-blue-700 border-blue-100",
  IN_PROGRESS: "bg-yellow-50 text-yellow-700 border-yellow-100",
  RESOLVED: "bg-green-50 text-green-700 border-green-100",
  CLOSED: "bg-gray-100 text-gray-600 border-gray-200",
};

const FEEDBACK_STATUS_LABELS: Record<string, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

const FEEDBACK_CATEGORY_LABELS: Record<string, string> = {
  BUG_REPORT: "Bug Report",
  FEATURE_REQUEST: "Feature Request",
  EVENT_EXPERIENCE: "Event Experience",
  GENERAL: "General",
  SUPPORT: "Support",
};

interface EditEventData {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  price: number;
  status: string;
  description: string;
  imageUrl?: string | null;
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingEvent, setEditingEvent] = useState<EditEventData | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ type: "event" | "user", id: string } | null>(null);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [updatingFeedbackId, setUpdatingFeedbackId] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === "events" && events.length === 0) {
      loadEvents();
    } else if (activeTab === "users" && users.length === 0) {
      loadUsers();
    } else if (activeTab === "feedback" && feedbackList.length === 0) {
      loadFeedback();
    }
  }, [activeTab]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const statsData = await adminApi.getDashboardStats();
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
      toast.error("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = async () => {
    try {
      const eventsData = await adminApi.getAllEvents();
      setEvents(eventsData);
    } catch (error) {
      console.error("Failed to load events:", error);
      toast.error("Failed to load events");
    }
  };

  const loadUsers = async () => {
    try {
      const usersData = await adminApi.getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error("Failed to load users:", error);
      toast.error("Failed to load users");
    }
  };

  const loadFeedback = async () => {
    setFeedbackLoading(true);
    try {
      const data = await feedbackApi.getAll();
      setFeedbackList(data);
    } catch (error) {
      console.error("Failed to load feedback:", error);
      toast.error("Failed to load feedback");
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleFeedbackStatusUpdate = async (id: string, status: FeedbackStatus, adminNotes?: string) => {
    setUpdatingFeedbackId(id);
    try {
      const updated = await feedbackApi.updateStatus(id, { status, adminNotes });
      setFeedbackList((prev) => prev.map((f) => (f.id === id ? updated : f)));
      toast.success("Feedback status updated");
    } catch (error) {
      console.error("Failed to update feedback status:", error);
      toast.error("Failed to update feedback status");
    } finally {
      setUpdatingFeedbackId(null);
    }
  };

  const handleFeedbackDelete = async (id: string) => {
    try {
      await feedbackApi.delete(id);
      setFeedbackList((prev) => prev.filter((f) => f.id !== id));
      toast.success("Feedback deleted");
    } catch (error) {
      console.error("Failed to delete feedback:", error);
      toast.error("Failed to delete feedback");
    }
  };

  const handleUpdateEvent = async () => {
    if (!editingEvent) return;

    try {
      await adminApi.updateEvent(editingEvent.id, editingEvent);
      toast.success("Event updated successfully");
      setEditingEvent(null);
      loadEvents();
    } catch (error) {
      console.error("Failed to update event:", error);
      toast.error("Failed to update event");
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await adminApi.deleteEvent(id);
      toast.success("Event deleted successfully");
      setEvents(events.filter(e => e.id !== id));
      setShowDeleteConfirm(null);
      loadDashboardData();
    } catch (error) {
      console.error("Failed to delete event:", error);
      toast.error("Failed to delete event");
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await adminApi.deleteUser(id);
      toast.success("User deleted successfully");
      setUsers(users.filter(u => u.id !== id));
      setShowDeleteConfirm(null);
      loadDashboardData();
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user");
    }
  };

  const handleBanUser = async (id: string) => {
    try {
      await adminApi.banUser(id);
      toast.success("User banned successfully");
      loadUsers();
    } catch (error) {
      console.error("Failed to ban user:", error);
      toast.error("Failed to ban user");
    }
  };

  const handleUnbanUser = async (id: string) => {
    try {
      await adminApi.unbanUser(id);
      toast.success("User unbanned successfully");
      loadUsers();
    } catch (error) {
      console.error("Failed to unban user:", error);
      toast.error("Failed to unban user");
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderOverview = () => {
    if (loading || !stats) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      );
    }

    const statCards = [
      { label: "Total Events", value: stats.totalEvents, icon: Calendar, color: "indigo", trend: `${stats.upcomingEvents} upcoming` },
      { label: "Total Users", value: stats.totalUsers, icon: Users, color: "blue", trend: "All registered users" },
      { label: "Total Attendees", value: stats.totalAttendees, icon: Users, color: "purple", trend: "Event participants" },
      { label: "Tickets Sold", value: stats.totalTicketsSold, icon: Ticket, color: "green", trend: "Total transactions" },
    ];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={clsx(
                  "p-3 rounded-lg",
                  stat.color === "indigo" && "bg-indigo-100",
                  stat.color === "blue" && "bg-blue-100",
                  stat.color === "purple" && "bg-purple-100",
                  stat.color === "green" && "bg-green-100"
                )}>
                  <stat.icon className={clsx(
                    "w-6 h-6",
                    stat.color === "indigo" && "text-indigo-600",
                    stat.color === "blue" && "text-blue-600",
                    stat.color === "purple" && "text-purple-600",
                    stat.color === "green" && "text-green-600"
                  )} />
                </div>
              </div>
              <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-2">{stat.trend}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Broadcast Message Form */}
          <BroadcastMessageForm />

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => setActiveTab("events")}
                className="w-full flex items-center justify-between p-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-100 transition-colors"
              >
                <span className="text-sm font-medium text-indigo-700">Manage Events</span>
                <Calendar className="w-5 h-5 text-indigo-600" />
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-100 transition-colors"
              >
                <span className="text-sm font-medium text-blue-700">Manage Users</span>
                <Users className="w-5 h-5 text-blue-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEvents = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Event Management</h2>
            <p className="text-gray-500 mt-1">View, edit, and delete events</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{event.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {event.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {event.date} {event.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">LKR {event.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={clsx(
                        "px-2 py-1 text-xs font-medium rounded-full",
                        event.status === "Upcoming" ? "bg-green-50 text-green-700 border border-green-100" : "bg-gray-50 text-gray-700 border border-gray-100"
                      )}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setEditingEvent(event as EditEventData)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm({ type: "event", id: event.id })}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredEvents.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No events found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderUsers = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
            <p className="text-gray-500 mt-1">Manage user accounts and permissions</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={clsx(
                        "px-2 py-1 text-xs font-medium rounded-full border",
                        user.role === "organizer" ? "bg-purple-50 text-purple-700 border-purple-100" : "bg-blue-50 text-blue-700 border-blue-100"
                      )}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={clsx(
                        "px-2 py-1 text-xs font-medium rounded-full border",
                        user.status === "banned" ? "bg-red-50 text-red-700 border-red-100" : "bg-green-50 text-green-700 border-green-100"
                      )}>
                        {user.status === "banned" ? "Banned" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      {user.status === "banned" ? (
                        <button
                          onClick={() => handleUnbanUser(user.id)}
                          className="inline-flex items-center text-green-600 hover:text-green-900"
                          title="Unban user"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBanUser(user.id)}
                          className="inline-flex items-center text-orange-600 hover:text-orange-900"
                          title="Ban user"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setShowDeleteConfirm({ type: "user", id: user.id })}
                        className="inline-flex items-center text-red-600 hover:text-red-900"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No users found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderFeedback = () => {
    if (feedbackLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
        </div>
      );
    }

    const filtered = feedbackList.filter((f) =>
      f.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Feedback Inbox</h2>
            <p className="text-gray-500 mt-1">Review and respond to user feedback</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search feedback..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={loadFeedback}
              className="px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm text-center py-16">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">No feedback found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((item) => (
              <FeedbackRow
                key={item.id}
                item={item}
                updating={updatingFeedbackId === item.id}
                onStatusUpdate={handleFeedbackStatusUpdate}
                onDelete={handleFeedbackDelete}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage events, users, and view system analytics</p>
        </div>
        <NotificationBell />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "overview" as TabType, label: "Overview", icon: TrendingUp },
            { id: "events" as TabType, label: "Events", icon: Calendar },
            { id: "users" as TabType, label: "Users", icon: Users },
            { id: "feedback" as TabType, label: "Feedback", icon: MessageSquare },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSearchTerm("");
              }}
              className={clsx(
                "flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === tab.id
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
        {activeTab === "overview" && renderOverview()}
        {activeTab === "events" && renderEvents()}
        {activeTab === "users" && renderUsers()}
        {activeTab === "feedback" && renderFeedback()}
      </div>

      {/* Edit Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Edit Event</h3>
              <button onClick={() => setEditingEvent(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={editingEvent.category}
                    onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editingEvent.status}
                    onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={editingEvent.date}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={editingEvent.time}
                    onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={editingEvent.location}
                  onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  value={editingEvent.price}
                  onChange={(e) => setEditingEvent({ ...editingEvent, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editingEvent.description}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
                <input
                  type="text"
                  value={editingEvent.imageUrl || ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
              <button
                onClick={() => setEditingEvent(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateEvent}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Status Update Quick-access is inline in FeedbackRow */}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Confirm Deletion</h3>
              <p className="text-gray-500 text-center mb-6">
                Are you sure you want to delete this {showDeleteConfirm.type}? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (showDeleteConfirm.type === "event") {
                      handleDeleteEvent(showDeleteConfirm.id);
                    } else {
                      handleDeleteUser(showDeleteConfirm.id);
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- FeedbackRow sub-component ----

interface FeedbackRowProps {
  item: FeedbackItem;
  updating: boolean;
  onStatusUpdate: (id: string, status: FeedbackStatus, adminNotes?: string) => void;
  onDelete: (id: string) => void;
}

function FeedbackRow({ item, updating, onStatusUpdate, onDelete }: FeedbackRowProps) {
  const [expanded, setExpanded] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState(item.adminNotes ?? "");

  const STATUSES: FeedbackStatus[] = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Row header */}
      <div
        className="flex items-start gap-4 px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-900 truncate">{item.subject}</span>
            <span className={clsx("text-xs font-medium px-2 py-0.5 rounded-full border", FEEDBACK_STATUS_STYLES[item.status])}>
              {FEEDBACK_STATUS_LABELS[item.status]}
            </span>
            <span className="text-xs text-indigo-600 font-medium">
              {FEEDBACK_CATEGORY_LABELS[item.category] ?? item.category}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {item.userName} &bull; {item.userEmail} &bull; {new Date(item.createdAt).toLocaleDateString()}
          </p>
        </div>
        {item.satisfactionScore != null && (
          <div className="flex items-center gap-1 flex-shrink-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={clsx("w-3.5 h-3.5", i < item.satisfactionScore! ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200")}
              />
            ))}
          </div>
        )}
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-gray-100 px-6 py-4 space-y-4">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.message}</p>

          {/* Status changer */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-gray-500">Change status:</span>
            {STATUSES.map((s) => (
              <button
                key={s}
                disabled={updating || item.status === s}
                onClick={() => onStatusUpdate(item.id, s, notes || undefined)}
                className={clsx(
                  "text-xs px-2.5 py-1 rounded-full border font-medium transition-colors",
                  item.status === s
                    ? FEEDBACK_STATUS_STYLES[s]
                    : "border-gray-200 text-gray-500 hover:bg-gray-50",
                  updating && "opacity-50 cursor-not-allowed"
                )}
              >
                {FEEDBACK_STATUS_LABELS[s]}
              </button>
            ))}
          </div>

          {/* Admin notes */}
          {editingNotes ? (
            <div className="space-y-2">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Add an internal note or response visible to the user…"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onStatusUpdate(item.id, item.status, notes);
                    setEditingNotes(false);
                  }}
                  className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Save Note
                </button>
                <button
                  onClick={() => { setNotes(item.adminNotes ?? ""); setEditingNotes(false); }}
                  className="px-3 py-1.5 border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              {item.adminNotes && (
                <div className="mb-2 px-3 py-2 bg-indigo-50 rounded-lg">
                  <p className="text-xs font-semibold text-indigo-700 mb-0.5">Admin Note</p>
                  <p className="text-xs text-indigo-800">{item.adminNotes}</p>
                </div>
              )}
              <button
                onClick={() => setEditingNotes(true)}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
              >
                {item.adminNotes ? "Edit note" : "+ Add note"}
              </button>
            </div>
          )}

          {/* Delete */}
          <div className="flex justify-end pt-1">
            <button
              onClick={() => onDelete(item.id)}
              className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
