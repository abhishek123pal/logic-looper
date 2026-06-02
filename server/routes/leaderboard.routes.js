import express from "express";
import { getPrisma } from "../prisma/client.js"; 

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = getPrisma();
    const top = await db.user.findMany({ take: 100 });
    
    console.log("✅ Top 100 Leaderboard fetched");
    res.json(top || []); 

  } catch (error) {
    console.error("❌ DB Error:", error.message);
    res.status(500).json({ 
      error: "Database Connection Error", 
      message: error.message 
    });
  }
});

export default router;