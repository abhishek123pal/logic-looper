import { query } from "./prisma/client.js";

async function seedData() {
    try {
        console.log("Adding dummy players...");
        
        // Pure JS se random ID generate kar rahe hain
        const id1 = "user_" + Date.now() + "_1";
        const id2 = "user_" + Date.now() + "_2";

        await query(
            'INSERT INTO "User" (id, email, "totalPoints") VALUES ($1, $2, $3)', 
            [id1, 'bhai@test.com', 500]
        );
        
        await query(
            'INSERT INTO "User" (id, email, "totalPoints") VALUES ($1, $2, $3)', 
            [id2, 'player2@test.com', 350]
        );

        console.log("✅ Success! Ab browser mein leaderboard refresh karke dekho.");
        process.exit();
    } catch (err) {
        console.error("❌ Error:", err.message);
        process.exit(1);
    }
}

seedData();