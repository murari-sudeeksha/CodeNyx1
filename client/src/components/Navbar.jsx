import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-bold text-brand-700">🛡️ MindShield</Link>
        <div className="flex items-center gap-4 text-sm">
          {user && (
            <>
              <Link to="/dashboard" className="text-gray-600 hover:text-brand-600">Dashboard</Link>
              <Link to="/mood" className="text-gray-600 hover:text-brand-600">Mood</Link>
              <Link to="/chat" className="text-gray-600 hover:text-brand-600">AI Chat</Link>
              <Link to="/safe-circle" className="text-gray-600 hover:text-brand-600">Safe Circle</Link>
              {!user.isAnonymous && (
                <>
                  <Link to="/mentor" className="text-gray-600 hover:text-brand-600">Mentor</Link>
                  <Link to="/insights" className="text-gray-600 hover:text-brand-600">Insights</Link>
                </>
              )}
              {user.role === "admin" && (
                <Link to="/ngo" className="text-gray-600 hover:text-brand-600">NGO Panel</Link>
              )}
              <button onClick={logout} className="text-danger-500 hover:text-danger-600">Logout</button>
            </>
          )}
          {!user && (
            <>
              <Link to="/login" className="text-gray-600 hover:text-brand-600">Login</Link>
              <Link to="/register" className="px-3 py-1.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
