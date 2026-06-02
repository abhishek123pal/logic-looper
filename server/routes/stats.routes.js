import express from "express";
import { query } from "../prisma/client.js";

const router = express.Router();

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  console.log("🔍 Fetching stats for UID:", userId); // Debugging line

  try {
    // 1. Pehle check karein ki kya ye user "User" table mein hai?
    const checkUser = await query('SELECT id FROM "User" WHERE id = $1', [userId]);

    // 💡 AGAR USER NAHI HAI, TOH PEHLE USE CREATE KAREIN (Safety Net)
    if (checkUser.rows.length === 0) {
      console.log("⚠️ User not found in 'User' table. Creating temporary record...");
      await query(
        'INSERT INTO "User" (id, email, "totalPoints") VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
        [userId, `guest_${userId.slice(0,5)}@logic.com`, 0]
      );
    }

    // 2. Ab Join Query chalayein
    const userQuery = `
      SELECT u.id, u."totalPoints", 
             COALESCE(s."puzzlesSolved", 0) as "puzzlesSolved", 
             COALESCE(s."avgTime", 0) as "avgTime"
      FROM "User" u
      LEFT JOIN "UserStats" s ON u.id = s."userId"
      WHERE u.id = $1
    `;
    const userResult = await query(userQuery, [userId]);
    const userData = userResult.rows[0];

    // 3. Rank calculation (Isme error tab aata hai agar totalPoints null ho)
    const rankQuery = `
      SELECT COUNT(*) as rank 
      FROM "User" 
      WHERE "totalPoints" > (SELECT COALESCE("totalPoints", 0) FROM "User" WHERE id = $1)
    `;
    const rankResult = await query(rankQuery, [userId]);
    const globalRank = parseInt(rankResult.rows[0].rank) + 1;

    res.json({
      success: true,
      stats: {
        ...userData,
        globalRank: globalRank
      }
    });

  } catch (err) {
    console.error("❌ Stats Fetch Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;