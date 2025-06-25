import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
const corsOptions = {
  origin: `http://localhost:3000`,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api", userRoutes);

// DB and Server Init
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
