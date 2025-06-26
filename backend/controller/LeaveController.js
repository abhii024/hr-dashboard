import Leave from "../models/Leave.js";

class LeaveController {
  static async createLeave(req, res) {
    try {
      const { designation, leaveDate, reason, _id } = req.body;
      const file = req.file;

      if (!file)
        return res.status(400).json({ message: "Document is required" });

      const leave = await Leave.create({
        employee: _id,
        designation,
        leaveDate,
        reason,
        documents: file.filename,
      });

      res.status(201).json(leave);
    } catch (error) {
      console.error("Leave creation error:", error);
      res.status(500).json({ message: "Failed to create leave entry" });
    }
  }

  static async getLeaves(req, res) {
    try {
      const { status } = req.query;

      const filter = {};
      if (status) {
        filter.status = status;
      }

      const leaves = await Leave.find(filter).populate(
        "employee",
        "fullName email"
      );

      res.status(200).json(leaves);
    } catch (err) {
      console.error("Error fetching leaves:", err);
      res.status(500).json({ message: "Failed to fetch leave records" });
    }
  }

  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ["pending", "approved", "rejected"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const leave = await Leave.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!leave) {
        return res.status(404).json({ message: "Leave not found" });
      }

      res.status(200).json({ message: "Status updated successfully", data: leave });
    } catch (err) {
      console.error("Error updating leave status:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
}

export default LeaveController;
