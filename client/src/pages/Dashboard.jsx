import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const cards = [
    { to: "/mood", icon: "😊", title: "Mood Check-in", desc: "How are you feeling?", color: "bg-warm-50 border-warm-200" },
    { to: "/chat", icon: "🤖", title: "AI Chat", desc: "Talk to a supportive AI", color: "bg-calm-50 border-calm-200" },
    { to: "/safe-circle", icon: "👥", title: "Safe Circle", desc: "Anonymous peer support", color: "bg-brand-50 border-brand-200" },
  ];

  if (!user?.isAnonymous) {
    cards.push(
      { to: "/mentor", icon: "🤝", title: "Mentor", desc: "Connect with a mentor", color: "bg-purple-50 border-purple-200" },
      { to: "/insights", icon: "📊", title: "Insights", desc: "View your progress", color: "bg-emerald-50 border-emerald-200" }
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Welcome{user?.isAnonymous ? "" : `, ${user?.email?.split("@")[0]}`} 👋
      </h1>
      <p className="text-gray-500 mb-8">
        {user?.isAnonymous ? "You're browsing anonymously. Your privacy is protected." : "Your safe space for mental wellness."}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className={`${c.color} border rounded-2xl p-6 hover:shadow-md transition`}>
            <div className="text-4xl mb-3">{c.icon}</div>
            <h3 className="font-bold text-gray-900 mb-1">{c.title}</h3>
            <p className="text-gray-500 text-sm">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
