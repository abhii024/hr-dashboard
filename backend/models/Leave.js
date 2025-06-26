import mongoose from "mongoose";

const LeaveSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate", // or your User model
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    leaveDate: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    documents: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["approved", "pending", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Leave", LeaveSchema);
