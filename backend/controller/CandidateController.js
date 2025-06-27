// controller/CandidateController.js
import Candidate from "../models/Candidate.js";

class CandidateController {
  static async create(req, res) {
    try {
      const { fullName, email, phone, position, experience } = req.body;
      const resume = req.file?.filename;

      if (!resume) {
        return res.status(400).json({ message: "Resume file is required" });
      }

      const candidate = new Candidate({
        fullName,
        email,
        phone,
        position,
        experience,
        resume,
      });

      await candidate.save();

      return res.status(201).json({
        message: "Candidate created successfully",
        candidate,
      });
    } catch (err) {
      console.error("Error creating candidate:", err);
      return res.status(500).json({ message: "Server Error" });
    }
  }

  static async getCandidateData(req, res) {
    try {
      const { status, position } = req.query;

      const filter = {};
      if (status) filter.status = status;
      if (position) filter.position = position;

      const candidates = await Candidate.find(filter).sort({ createdAt: -1 });

      return res.status(200).json(candidates);
    } catch (err) {
      console.error("Error fetching candidates:", err);
      return res.status(500).json({ message: "Server Error" });
    }
  }

  static async deleteCandidate(req, res) {
    try {
      const { id } = req.params;

      const deleted = await Candidate.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ message: "Candidate not found" });
      }

      res.status(200).json({ message: "Candidate deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Server Error" });
    }
  }

  static async updateCandidate(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const updated = await Candidate.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });

      if (!updated) {
        return res.status(404).json({ message: "Candidate not found" });
      }

      res.status(200).json({ message: "Candidate updated", data: updated });
    } catch (err) {
      res.status(500).json({ message: "Server Error" });
    }
  }

  static async changeAttendanceStatus(req, res) {
    try {
      const { id } = req.params;
      const { attendanceStatus } = req.body;

      if (!["present", "absent"].includes(attendanceStatus)) {
        return res.status(400).json({ message: "Invalid attendance status" });
      }

      const updatedCandidate = await Candidate.findByIdAndUpdate(
        id,
        { attendanceStatus },
        { new: true }
      );

      if (!updatedCandidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }

      res.status(200).json({
        message: "Attendance status updated",
        data: updatedCandidate,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }

   static async updateStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["New", "Scheduled", "Ongoing", "Selected", "Rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    try {
      const updatedCandidate = await Candidate.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!updatedCandidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }

      res.status(200).json({
        message: "Candidate status updated successfully",
        candidate: updatedCandidate,
      });
    } catch (error) {
      console.error("Error updating candidate status:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default CandidateController;
