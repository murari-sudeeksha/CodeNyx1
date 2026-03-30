import { Router } from "express";
import Mood from "../models/Mood.js";
import User from "../models/User.js";
import CrisisAlert from "../models/CrisisAlert.js";
import { analyzeMessage } from "../services/aiService.js";
import { optionalAuth } from "../middleware/auth.js";

const router = Router();

router.post("/", optionalAuth, async (req, res) => {
  try {
    const userId = req.user?.id || req.body.anonymousId;
    if (!userId) return res.status(400).json({ error: "User ID required" });
    const { mood, emoji, note } = req.body;
    const entry = await Mood.create({ userId, mood, emoji, note });

    let crisis = null;
    if (note) {
     const sentiment = await analyzeMessage(note);
      if (sentiment.crisis || sentiment.severity === "high" || sentiment.severity === "critical") {
        crisis = await CrisisAlert.create({
          userId,
          severity: sentiment.severity,
          triggerSource: "mood",
          triggerContent: note,
        });
        await User.findOneAndUpdate(
          { $or: [{ _id: userId }, { anonymousId: userId }] },
          { riskLevel: sentiment.severity }
        );
      }
    }
    if (mood <= 2) {
      await User.findOneAndUpdate(
        { $or: [{ _id: userId }, { anonymousId: userId }] },
        { riskLevel: "medium" }
      );
    }
    res.json({ entry, crisis });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/history/:userId", optionalAuth, async (req, res) => {
  try {
    const moods = await Mood.find({ userId: req.params.userId }).sort({ timestamp: -1 }).limit(30);
    res.json(moods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
