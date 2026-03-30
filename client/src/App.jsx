import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import MoodCheckin from "./pages/MoodCheckin";
import AIChat from "./pages/AIChat";
import SafeCircle from "./pages/SafeCircle";
import MentorChat from "./pages/MentorChat";
import Insights from "./pages/Insights";
import NGODashboard from "./pages/NGODashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CrisisModal from "./components/CrisisModal";
import { useState } from "react";

export default function App() {
  const [crisis, setCrisis] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {crisis && <CrisisModal crisis={crisis} onClose={() => setCrisis(null)} />}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mood" element={<MoodCheckin onCrisis={setCrisis} />} />
          <Route path="/chat" element={<AIChat onCrisis={setCrisis} />} />
          <Route path="/safe-circle" element={<SafeCircle />} />
          <Route path="/mentor" element={<MentorChat />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/ngo" element={<NGODashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}
