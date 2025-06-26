import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      enum: ["Human Resource", "Designer", "Developer"],
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    resume: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["New", "Scheduled", "Ongoing", "Selected", "Rejected"],
      default: "New",
    },
    dateOfJoining: {
      type: Date,
      default: Date.now,
    },
    department: {
      type: String,
    },
    attendanceStatus: {
      type: String,
      enum: ["present", "absent"],
      default: "absent",
    },
  },
  { timestamps: true }
);

const Candidate = mongoose.model("Candidate", candidateSchema);

export default Candidate;
