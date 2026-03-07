import { useState, useEffect } from "react";
import { feedbackApi, type FeedbackItem } from "../services/eventflow";
import { FeedbackForm } from "../components/FeedbackForm";
import { useAuth } from "../contexts/AuthContext";
import { MessageSquare, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { toast } from "sonner";
import clsx from "clsx";

const STATUS_STYLES: Record<string, string> = {
  OPEN: "bg-blue-50 text-blue-700",
  IN_PROGRESS: "bg-yellow-50 text-yellow-700",
  RESOLVED: "bg-green-50 text-green-700",
  CLOSED: "bg-gray-100 text-gray-600",
};

const STATUS_LABELS: Record<string, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

const CATEGORY_LABELS: Record<string, string> = {
  BUG_REPORT: "Bug Report",
  FEATURE_REQUEST: "Feature Request",
  EVENT_EXPERIENCE: "Event Experience",
  GENERAL: "General Feedback",
  SUPPORT: "Support Request",
};

export function FeedbackPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState<FeedbackItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(false);

  const loadHistory = async () => {
    if (!user) return;
    try {
      const data = await feedbackApi.getByUser(user.id);
      setHistory(data);
    } catch {
      toast.error("Failed to load feedback history");
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    void loadHistory();
  }, [user?.id]);

  const handleSuccess = (item: FeedbackItem) => {
    setHistory((prev) => [item, ...prev]);
    setHistoryOpen(true);
  };

  if (!user) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <MessageSquare className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Feedback</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Help us improve EventFlow by sharing your experience.
          </p>
        </div>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Form */}
        <FeedbackForm
          userId={user.id}
          userName={user.name}
          userEmail={user.email ?? ""}
          onSuccess={handleSuccess}
        />

        {/* Previous Feedback collapsible */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={() => setHistoryOpen((o) => !o)}
            className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-semibold text-gray-800">
              My Previous Feedback
              {history.length > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium">
                  {history.length}
                </span>
              )}
            </span>
            {historyOpen ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {historyOpen && (
            <div className="border-t border-gray-100">
              {loadingHistory ? (
                <div className="flex items-center justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
                </div>
              ) : history.length === 0 ? (
                <div className="px-6 py-10 text-center">
                  <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No feedback submitted yet.</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {history.map((item) => (
                    <li key={item.id} className="px-6 py-4 space-y-1.5">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-semibold text-gray-900 leading-snug">
                          {item.subject}
                        </p>
                        <span
                          className={clsx(
                            "flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full",
                            STATUS_STYLES[item.status]
                          )}
                        >
                          {STATUS_LABELS[item.status]}
                        </span>
                      </div>
                      <p className="text-xs text-indigo-600 font-medium">
                        {CATEGORY_LABELS[item.category] ?? item.category}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2">{item.message}</p>
                      {item.adminNotes && (
                        <div className="mt-2 px-3 py-2 bg-indigo-50 rounded-lg">
                          <p className="text-xs font-semibold text-indigo-700 mb-0.5">Admin Response</p>
                          <p className="text-xs text-indigo-800">{item.adminNotes}</p>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-xs text-gray-400 pt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
