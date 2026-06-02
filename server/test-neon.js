import 'dotenv/config'; 
import http from 'http';
import { neon } from '@neondatabase/serverless';

// Debug check
console.log("Checking environment...");
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("your_neon")) {
    console.error("❌ Still using placeholder! Update your .env file.");
    process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

const requestHandler = async (req, res) => {
  try {
    const result = await sql`SELECT version()`;
    const version = result[0].version;
    console.log("✅ Database queried successfully!");
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(`Neon Connection Success! Version: ${version}`);
  } catch (err) {
    console.error("❌ Database Error:", err);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end(`Connection Failed: ${err.message}`);
  }
};

const PORT = 3001; // Using 3001 to avoid conflict with your main server
http.createServer(requestHandler).listen(PORT, () => {
  console.log(`🚀 Test server running at http://localhost:${PORT}`);
  console.log("Visit this URL in your browser to test the connection.");
});