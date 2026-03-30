import { Router } from "express";
import Chat from "../models/Chat.js";
import CrisisAlert from "../models/CrisisAlert.js";
import { analyzeMessage } from "../services/aiService.js";
import { optionalAuth } from "../middleware/auth.js";

const router = Router();

router.post("/ai", optionalAuth, async (req, res) => {
  try {
    const userId = req.user?.id || req.body.anonymousId;
    const { message, chatId } = req.body;

    let chat;
    if (chatId) {
      chat = await Chat.findById(chatId);
    }
    if (!chat) {
      chat = await Chat.create({ userId, type: "ai", messages: [] });
    }

    chat.messages.push({ role: "user", content: message });

    const aiMessages = chat.messages.map((m) => ({ role: m.role, content: m.content }));
    const reply = await chatWithAI(aiMessages);

    chat.messages.push({ role: "assistant", content: reply });

    const sentiment = await analyzeSentiment(message);
    chat.sentimentScore = sentiment.score;
    await chat.save();

    let crisis = null;
    if (sentiment.crisis || sentiment.severity === "high" || sentiment.severity === "critical") {
      crisis = await CrisisAlert.create({
        userId,
        severity: sentiment.severity,
        triggerSource: "chat",
        triggerContent: message,
      });
    }

    res.json({ reply, chatId: chat._id, crisis, sentiment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/history/:userId", optionalAuth, async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
