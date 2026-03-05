import { useState } from "react";
import { feedbackApi, type FeedbackCategory, type FeedbackItem } from "../services/eventflow";
import { StarRating } from "./StarRating";
import { toast } from "sonner";
import { Send } from "lucide-react";

interface FeedbackFormProps {
  userId: string;
  userName: string;
  userEmail: string;
  onSuccess: (item: FeedbackItem) => void;
}

const CATEGORY_LABELS: Record<FeedbackCategory, string> = {
  BUG_REPORT: "Bug Report",
  FEATURE_REQUEST: "Feature Request",
  EVENT_EXPERIENCE: "Event Experience",
  GENERAL: "General Feedback",
  SUPPORT: "Support Request",
};

const CATEGORIES = Object.keys(CATEGORY_LABELS) as FeedbackCategory[];

export function FeedbackForm({ userId, userName, userEmail, onSuccess }: FeedbackFormProps) {
  const [category, setCategory] = useState<FeedbackCategory | "">("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [satisfactionScore, setSatisfactionScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) {
      toast.error("Please select a category");
      return;
    }

    setSubmitting(true);
    try {
      const result = await feedbackApi.submit({
        userId,
        userName,
        userEmail,
        category,
        subject,
        message,
        satisfactionScore: satisfactionScore > 0 ? satisfactionScore : null,
      });
      toast.success("Feedback submitted! Thank you.");
      onSuccess(result);
      // Reset form
      setCategory("");
      setSubject("");
      setMessage("");
      setSatisfactionScore(0);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit feedback";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
      <div>
        <h3 className="text-lg font-bold text-gray-900">Submit Feedback</h3>
        <p className="text-sm text-gray-500 mt-0.5">
          Share your thoughts, report issues, or suggest improvements.
        </p>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as FeedbackCategory)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
          required
        >
          <option value="">Select a category…</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORY_LABELS[cat]}
            </option>
          ))}
        </select>
      </div>

      {/* Subject */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Subject <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          maxLength={200}
          placeholder="Brief summary of your feedback…"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-400 mt-1 text-right">{subject.length}/200</p>
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={2000}
          rows={5}
          placeholder="Describe your feedback in detail…"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
        />
        <p className="text-xs text-gray-400 mt-1 text-right">{message.length}/2000</p>
      </div>

      {/* Satisfaction Score */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Overall Satisfaction{" "}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <div className="flex items-center gap-3">
          <StarRating value={satisfactionScore} onChange={setSatisfactionScore} size="lg" />
          {satisfactionScore > 0 && (
            <span className="text-sm text-gray-500">
              {["", "Very Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very Satisfied"][satisfactionScore]}
            </span>
          )}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting || !category || !subject.trim() || !message.trim()}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send className="w-4 h-4" />
        {submitting ? "Submitting…" : "Submit Feedback"}
      </button>
    </form>
  );
}
