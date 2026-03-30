import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler } from "chart.js";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

export default function Insights() {
  const { user } = useAuth();
  const [moods, setMoods] = useState([]);

  useEffect(() => {
    if (user?.id) {
      api.get(`/mood/history/${user.id}`).then(({ data }) => setMoods(data.reverse()));
    }
  }, [user]);

  const chartData = {
    labels: moods.map((m) => new Date(m.timestamp).toLocaleDateString()),
    datasets: [{
      label: "Mood",
      data: moods.map((m) => m.mood),
      borderColor: "#22c55e",
      backgroundColor: "rgba(34,197,94,0.1)",
      fill: true,
      tension: 0.4,
    }],
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Your Insights</h1>
      <p className="text-gray-500 mb-8">Track your mood over time.</p>
      {moods.length > 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <Line data={chartData} options={{ responsive: true, scales: { y: { min: 1, max: 5 } } }} />
        </div>
      ) : (
        <p className="text-gray-400 text-center py-10">No mood data yet. Start checking in!</p>
      )}
    </div>
  );
}
