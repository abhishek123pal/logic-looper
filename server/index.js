import process from 'node:process';
import 'dotenv/config'; // Pehle load hona chahiye
import express from "express";
import cors from "cors";

// Ek chota sa check terminal mein dekhne ke liye
console.log("--- CONFIG CHECK ---");
console.log("DATABASE_URL Loaded:", !!process.env.DATABASE_URL); 

import authRoutes from "./routes/auth.routes.js";
import scoreRoutes from "./routes/score.routes.js";
import leaderboardRoutes from "./routes/leaderboard.routes.js";
import statsRoutes from "./routes/stats.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Routes setup
app.use("/auth", authRoutes);
app.use("/scores", scoreRoutes);
app.use("/leaderboard", leaderboardRoutes);
app.use("/stats", statsRoutes);

app.listen(4000, () => console.log("Server running on 4000"));