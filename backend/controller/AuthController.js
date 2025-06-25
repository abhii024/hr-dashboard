import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey";

class AuthController {
  // ✅ Register method
  static async register(req, res) {
    try {
      const { fullName, email, password, confirmPassword } = req.body;

      if (!fullName || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required" });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({ fullName, email, password: hashedPassword });
      await newUser.save();

      const token = jwt.sign(
        { userId: newUser._id, email: newUser.email },
        JWT_SECRET,
        { expiresIn: "2h" }
      );

      res.status(201).json({ message: "Account created successfully", token });
    } catch (err) {
      console.error("Register Error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }

  // ✅ Login method
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: "2h" }
      );

      res.status(200).json({ message: "Login successful", token });
    } catch (err) {
      console.error("Login Error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
}

export default AuthController;
