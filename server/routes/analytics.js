import { Router } from "express";
import Mood from "../models/Mood.js";
import CrisisAlert from "../models/CrisisAlert.js";
import User from "../models/User.js";

const router = Router();

router.get("/dashboard", async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const moods = await Mood.find({ timestamp: { $gte: thirtyDaysAgo } });
    const avgMood = moods.length ? moods.reduce((s, m) => s + m.mood, 0) / moods.length : 0;

    const alerts = await CrisisAlert.countDocuments({ timestamp: { $gte: thirtyDaysAgo } });
    const activeUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    const dailyMoods = await Mood.aggregate([
      { $match: { timestamp: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          avg: { $avg: "$mood" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const severityCounts = await CrisisAlert.aggregate([
      { $match: { timestamp: { $gte: thirtyDaysAgo } } },
      { $group: { _id: "$severity", count: { $sum: 1 } } },
    ]);

    let stressLevel = "low";
    if (avgMood < 2) stressLevel = "critical";
    else if (avgMood < 3) stressLevel = "high";
    else if (avgMood < 3.5) stressLevel = "medium";

    res.json({
      avgMoodScore: Math.round(avgMood * 100) / 100,
      stressLevel,
      activeUsers,
      alertsCount: alerts,
      dailyMoods,
      severityCounts,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
