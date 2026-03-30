import { useState, useEffect } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import api from "../services/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function NGODashboard() {
  const [data, setData] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    api.get("/analytics/dashboard").then(({ data }) => setData(data));
    api.get("/crisis/alerts").then(({ data }) => setAlerts(data));
  }, []);

  if (!data) return <p className="text-center py-10 text-gray-400">Loading...</p>;

  const moodChart = {
    labels: data.dailyMoods.map((d) => d._id),
    datasets: [{
      label: "Average Mood",
      data: data.dailyMoods.map((d) => d.avg),
      backgroundColor: "rgba(59,130,246,0.5)",
      borderColor: "#3b82f6",
      borderWidth: 1,
    }],
  };

  const severityChart = {
    labels: data.severityCounts.map((s) => s._id),
    datasets: [{
      data: data.severityCounts.map((s) => s.count),
      backgroundColor: ["#fbbf24", "#f87171", "#dc2626"],
    }],
  };

  const resolveAlert = async (id) => {
    await api.put(`/crisis/resolve/${id}`);
    setAlerts(alerts.map((a) => (a._id === id ? { ...a, resolved: true } : a)));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">🏛️ NGO Dashboard</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Avg Mood", value: data.avgMoodScore, color: "bg-calm-50" },
          { label: "Stress Level", value: data.stressLevel, color: "bg-warm-50" },
          { label: "Active Users", value: data.activeUsers, color: "bg-brand-50" },
          { label: "Crisis Alerts", value: data.alertsCount, color: "bg-danger-50" },
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4 text-center`}>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h3 className="font-bold mb-2">Mood Trends</h3>
          <Bar data={moodChart} options={{ responsive: true, scales: { y: { min: 0, max: 5 } } }} />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h3 className="font-bold mb-2">Alert Severity</h3>
          <Doughnut data={severityChart} />
        </div>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Alerts</h2>
      <div className="space-y-2">
        {alerts.slice(0, 10).map((a) => (
          <div key={a._id} className={`flex items-center justify-between bg-white rounded-xl border p-4 ${a.resolved ? "opacity-50" : ""}`}>
            <div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${a.severity === "critical" ? "bg-danger-100 text-danger-600" : a.severity === "high" ? "bg-warm-100 text-warm-500" : "bg-gray-100 text-gray-600"}`}>
                {a.severity}
              </span>
              <span className="text-sm text-gray-500 ml-2">{a.triggerSource} — {new Date(a.timestamp).toLocaleString()}</span>
            </div>
            {!a.resolved && (
              <button onClick={() => resolveAlert(a._id)} className="text-xs text-brand-500 hover:text-brand-600">Resolve</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
