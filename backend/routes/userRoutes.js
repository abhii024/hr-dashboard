import express from "express";
import AuthController from "../controller/AuthController.js";
import CandidateController from "../controller/CandidateController.js";
// import upload from "../middlewares/upload.js";
import LeaveController from "../controller/LeaveController.js";
import upload, { setUploadType } from "../middlewares/upload.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
// router.post("/candidates", upload.single("resume"), CandidateController.create);
router.get("/candidates", authMiddleware, CandidateController.getCandidateData);
router.put("/candidates/:id/status", authMiddleware, CandidateController.updateStatus);
router.delete("/candidates/:id", CandidateController.deleteCandidate);
router.delete(
  "/candidates/:id",
  authMiddleware,
  CandidateController.deleteCandidate
);
router.put(
  "/candidates/:id",
  authMiddleware,
  CandidateController.updateCandidate
);
router.put(
  "/candidates/:id/attendance",
  authMiddleware,
  CandidateController.changeAttendanceStatus
);
router.post(
  "/leaves",
  upload.single("documents"),
  authMiddleware,
  LeaveController.createLeave
);
router.post(
  "/leaves",
  setUploadType("leave"),
  upload.single("documents"),
  authMiddleware,
  LeaveController.createLeave
);

router.post(
  "/candidates",
  setUploadType("resume"),
  upload.single("resume"),
  authMiddleware,
  CandidateController.create
);
router.get("/leaves", authMiddleware, LeaveController.getLeaves);
router.put("/leaves/:id/status", authMiddleware, LeaveController.updateStatus);
export default router;
