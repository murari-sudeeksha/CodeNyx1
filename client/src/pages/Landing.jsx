import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Landing() {
  const { user, loginAnonymous } = useAuth();
  const navigate = useNavigate();

  const handleAnonymous = async () => {
    await loginAnonymous();
    navigate("/dashboard");
  };

  if (user) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="text-center py-20">
      <div className="text-7xl mb-6">🛡️</div>
      <h1 className="text-5xl font-extrabold text-gray-900 mb-4">MindShield</h1>
      <p className="text-xl text-gray-500 mb-10 max-w-lg mx-auto">
        A safe, anonymous space for youth mental health support. Talk to AI, connect with peers, and find help — your privacy comes first.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleAnonymous}
          className="px-8 py-4 bg-brand-500 text-white rounded-2xl text-lg font-semibold hover:bg-brand-600 shadow-lg shadow-brand-200 transition"
        >
          Enter Anonymously
        </button>
        <button
          onClick={() => navigate("/register")}
          className="px-8 py-4 bg-white border-2 border-brand-500 text-brand-600 rounded-2xl text-lg font-semibold hover:bg-brand-50 transition"
        >
          Create Account
        </button>
      </div>
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
        {[
          { icon: "🤖", title: "AI Support", desc: "Chat with an empathetic AI, anytime" },
          { icon: "👥", title: "Safe Circle", desc: "Anonymous peer support by topic" },
          { icon: "🚨", title: "Crisis Help", desc: "Real-time detection & emergency resources" },
        ].map((f) => (
          <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="text-4xl mb-3">{f.icon}</div>
            <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
            <p className="text-gray-500 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
