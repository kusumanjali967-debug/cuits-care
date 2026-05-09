import express from "express";
import User from "../models/User.js";

const router = express.Router();

// =====================
// GET USER BY EMAIL
// =====================
router.get("/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    
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

    let user = await User.findOne({ email });

    if (user) {
      // Update existing
      Object.assign(user, req.body);
      await user.save();
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
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;