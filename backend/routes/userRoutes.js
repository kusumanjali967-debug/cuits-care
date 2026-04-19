import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, "../database.json");

const router = express.Router();

// Helper to interact with json db
const getDB = async () => {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    if (err.code === "ENOENT") {
      await fs.writeFile(DB_PATH, JSON.stringify({ users: [] }));
      return { users: [] };
    }
    throw err;
  }
};

const saveDB = async (data) => {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
};

// =====================
// GET USER BY EMAIL
// =====================
router.get("/:email", async (req, res) => {
  try {
    const db = await getDB();
    const user = db.users.find(u => u.email === req.params.email);
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// =====================
// UPSERT / SYNC USER DATA
// =====================
router.post("/", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email required" });

    const db = await getDB();
    const index = db.users.findIndex(u => u.email === email);

    let user;
    if (index !== -1) {
      // Update existing
      user = { ...db.users[index], ...req.body };
      db.users[index] = user;
    } else {
      // Create new
      user = { 
        skinType: "Unknown", 
        skinIssues: [], 
        currentProducts: [], 
        morningRoutine: [], 
        nightRoutine: [],
        score: 0, 
        history: [], 
        ...req.body 
      };
      db.users.push(user);
    }
    
    await saveDB(db);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;