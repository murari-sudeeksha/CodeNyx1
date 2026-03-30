import mongoose from "mongoose";
const mentorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  availability: { type: Boolean, default: true },
  assignedUsers: [String],
  specialization: String,
  createdAt: { type: Date, default: Date.now },
});
export default mongoose.model("Mentor", mentorSchema);
