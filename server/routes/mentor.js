import { Router } from "express";
import Mentor from "../models/Mentor.js";
import MentorRequest from "../models/MentorRequest.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = Router();

router.post("/request", authenticate, async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ availability: true });
    if (!mentor) return res.status(404).json({ error: "No mentors available" });
    const request = await MentorRequest.create({
      userId: req.user.id,
      mentorId: mentor._id,
    });
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/accept/:requestId", authenticate, requireRole("mentor"), async (req, res) => {
  try {
    const request = await MentorRequest.findByIdAndUpdate(
      req.params.requestId,
      { status: "accepted" },
      { new: true }
    );
    if (!request) return res.status(404).json({ error: "Request not found" });
    await Mentor.findOneAndUpdate(
      { userId: req.user.id },
      { $addToSet: { assignedUsers: request.userId } }
    );
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/requests", authenticate, requireRole("mentor"), async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ userId: req.user.id });
    const requests = await MentorRequest.find({ mentorId: mentor?._id, status: "pending" });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
