import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import User from "../models/User.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "../database.json");

// Helper to read local JSON database
async function readLocalDB() {
  try {
    const data = await fs.readFile(dbPath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading local JSON DB:", err.message);
    return { users: [] };
  }
}

// Helper to write local JSON database
async function writeLocalDB(data) {
  try {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing local JSON DB:", err.message);
  }
}

// =====================
// GET USER BY EMAIL
// =====================
router.get("/:email", async (req, res) => {
  const searchEmail = req.params.email.toLowerCase();
  try {
    // If MongoDB is connected, query MongoDB first
    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: searchEmail });
      if (user) {
        return res.json(user);
      }
    }

    // Otherwise, fall back to the local JSON database
    console.log(`📂 Fetching user ${searchEmail} from local JSON DB...`);
    const db = await readLocalDB();
    const user = db.users.find(u => u.email && u.email.toLowerCase() === searchEmail);
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error.message);
    // Secondary fallback to JSON in case query error occurs
    try {
      const db = await readLocalDB();
      const user = db.users.find(u => u.email && u.email.toLowerCase() === searchEmail);
      if (user) {
        return res.json(user);
      }
    } catch (innerErr) {
      console.error("Secondary fallback error:", innerErr.message);
    }
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
    const searchEmail = email.toLowerCase();

    let savedUser = null;

    // If MongoDB is connected, attempt MongoDB save
    if (mongoose.connection.readyState === 1) {
      try {
        let user = await User.findOne({ email: searchEmail });

        if (user) {
          // Update existing
          Object.assign(user, req.body);
          await user.save();
          savedUser = user.toObject();
        } else {
          // Create new
          user = new User({
            skinType: "Unknown", 
            skinIssues: [], 
            currentProducts: [], 
            morningRoutine: [], 
            nightRoutine: [],
            score: 0, 
            history: [], 
            ...req.body 
          });
          await user.save();
          savedUser = user.toObject();
        }
        console.log(`✅ Saved user ${searchEmail} to MongoDB.`);
      } catch (dbErr) {
        console.error("⚠️ MongoDB write failed, falling back to local JSON:", dbErr.message);
      }
    }

    // Always synchronize/backup to local JSON database as well so it's fully persistent locally!
    console.log(`📂 Synchronizing user ${searchEmail} to local JSON DB...`);
    const db = await readLocalDB();
    if (!db.users) db.users = [];
    
    const userIndex = db.users.findIndex(u => u.email && u.email.toLowerCase() === searchEmail);
    const existingUser = userIndex >= 0 ? db.users[userIndex] : {};
    
    const updatedData = {
      skinType: "Unknown", 
      skinIssues: [], 
      currentProducts: [], 
      morningRoutine: [], 
      nightRoutine: [],
      score: 0, 
      history: [],
      ...existingUser,
      ...req.body
    };

    if (userIndex >= 0) {
      db.users[userIndex] = updatedData;
    } else {
      db.users.push(updatedData);
    }
    await writeLocalDB(db);

    if (!savedUser) {
      savedUser = updatedData;
    }
    
    res.json(savedUser);
  } catch (error) {
    console.error("Error upserting user:", error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;