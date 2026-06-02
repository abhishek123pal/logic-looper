import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

// Neon/PostgreSQL connection string setup
const connectionString = process.env.DATABASE_URL;

console.log("--- PG DRIVER INITIALIZING ---");
if (connectionString) {
    console.log("✅ Connection String found");
}

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false // Neon ke liye ye line ZAROORI hai
    }
});

// Prisma-like query function
export const query = (text, params) => pool.query(text, params);

// getPrisma replacement (taaki routes na phatey)
export const getPrisma = () => {
    return {
        user: {
            findMany: async (args) => {
                // SQL query for Leaderboard
                const result = await pool.query(
                    'SELECT id, email, "totalPoints" FROM "User" ORDER BY "totalPoints" DESC LIMIT $1',
                    [args.take || 10]
                );
                return result.rows;
            }
        }
    };
};

export default pool;