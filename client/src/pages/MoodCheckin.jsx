import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const MOODS = [
  { value: 1, emoji: "😢", label: "Terrible" },
  { value: 2, emoji: "😔", label: "Bad" },
  { value: 3, emoji: "😐", label: "Okay" },
  { value: 4, emoji: "🙂", label: "Good" },
  { value: 5, emoji: "😊", label: "Great" },
];

export default function MoodCheckin({ onCrisis }) {
  const { user } = useAuth();
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const { data } = await api.post("/mood", {
        mood: selected.value,
        emoji: selected.emoji,
        note,
        anonymousId: user?.isAnonymous ? user.id : undefined,
      });
      setSubmitted(true);
      if (data.crisis) onCrisis?.(data.crisis);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">{selected.emoji}</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thanks for checking in!</h2>
        <p className="text-gray-500">Your mood has been recorded.</p>
        <button onClick={() => { setSubmitted(false); setSelected(null); setNote(""); }} className="mt-6 px-6 py-2 bg-brand-500 text-white rounded-xl hover:bg-brand-600">
          Check in again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">How are you feeling?</h1>
      <p className="text-gray-500 mb-8">Select the emoji that best describes your mood right now.</p>
      <div className="flex justify-between mb-8">
        {MOODS.map((m) => (
          <button key={m.value} onClick={() => setSelected(m)}
            className={`flex flex-col items-center p-3 rounded-2xl transition ${selected?.value === m.value ? "bg-brand-100 ring-2 ring-brand-400 scale-110" : "hover:bg-gray-100"}`}>
            <span className="text-4xl mb-1">{m.emoji}</span>
            <span className="text-xs text-gray-500">{m.label}</span>
          </button>
        ))}
      </div>
      <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Want to share more? (optional)" rows={3}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-400 outline-none resize-none mb-4" />
      <button onClick={handleSubmit} disabled={!selected || loading}
        className="w-full py-3 bg-brand-500 text-white rounded-xl font-semibold hover:bg-brand-600 disabled:opacity-50">
        {loading ? "Saving..." : "Submit"}
      </button>
    </div>
  );
}
