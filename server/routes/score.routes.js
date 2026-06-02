import express from "express";
import { query } from "../prisma/client.js";

const router = express.Router();

router.post("/sync", async (req, res) => {
  // Schema ke mutabik: id, email, score, time, date
  const { id, email, pointsToAdd, time, date } = req.body;

  if (!id) return res.status(400).json({ error: "User ID is required" });

  try {
    // 1️⃣ Update User Table (totalPoints aur streak)
    const userSql = `
      INSERT INTO "User" (id, email, "totalPoints")
      VALUES ($1, $2, $3)
      ON CONFLICT (id) 
      DO UPDATE SET 
        "totalPoints" = "User"."totalPoints" + EXCLUDED."totalPoints",
        email = COALESCE("User".email, EXCLUDED.email)
      RETURNING *;
    `;
    const userResult = await query(userSql, [id, email, pointsToAdd || 0]);

    // 2️⃣ Update Score Table (Heatmap ke liye daily entry)
    // Schema mein fields: userId, date, score, time
    const scoreSql = `
      INSERT INTO "Score" (id, "userId", date, score, time)
      VALUES (gen_random_uuid()::text, $1, $2, $3, $4)
      ON CONFLICT DO NOTHING; 
    `;
    // Note: Agar aap chahte hain ki ek din mein multiple entries update hon, 
    // toh Score model mein @@unique([userId, date]) add karna padega.
    await query(scoreSql, [id, date, pointsToAdd || 0, time || 0]);

    // 3️⃣ Update UserStats Table (puzzlesSolved aur avgTime)
    const statsSql = `
      INSERT INTO "UserStats" (id, "userId", "puzzlesSolved", "avgTime")
      VALUES (gen_random_uuid()::text, $1, 1, $2)
      ON CONFLICT ("userId") 
      DO UPDATE SET 
        "puzzlesSolved" = "UserStats"."puzzlesSolved" + 1,
        "avgTime" = ("UserStats"."avgTime" * "UserStats"."puzzlesSolved" + EXCLUDED."avgTime") / ("UserStats"."puzzlesSolved" + 1);
    `;
    await query(statsSql, [id, time || 0]);

    console.log(`✅ Transaction Complete: User, Score, and Stats updated for ${id}`);
    
    res.json({ 
      success: true, 
      user: userResult.rows[0] 
    });

  } catch (error) {
    console.error("❌ Deep Sync Error:", error.message);
    res.status(500).json({ error: "Database Sync Failed", message: error.message });
  }
});

export default router;