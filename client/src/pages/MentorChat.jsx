import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function MentorChat() {
  const { user } = useAuth();
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const requestMentor = async () => {
    setStatus("loading");
    try {
      await api.post("/mentor/request");
      setStatus("requested");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to request mentor");
      setStatus("error");
    }
  };

  if (user?.isAnonymous) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Required</h2>
        <p className="text-gray-500">Create an account to connect with a mentor. Your identity stays protected.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto text-center py-10">
      <div className="text-5xl mb-4">🤝</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Connect with a Mentor</h1>
      <p className="text-gray-500 mb-8">A trained volunteer will be matched with you anonymously.</p>
      {status === "idle" && (
        <button onClick={requestMentor} className="px-8 py-3 bg-brand-500 text-white rounded-xl font-semibold hover:bg-brand-600">
          Request a Mentor
        </button>
      )}
      {status === "loading" && <p className="text-gray-500">Finding a mentor...</p>}
      {status === "requested" && (
        <div className="bg-brand-50 border border-brand-200 rounded-2xl p-6">
          <p className="text-brand-700 font-semibold">✅ Request sent!</p>
          <p className="text-gray-500 text-sm mt-1">A mentor will reach out soon.</p>
        </div>
      )}
      {status === "error" && <p className="text-danger-500">{error}</p>}
    </div>
  );
}
