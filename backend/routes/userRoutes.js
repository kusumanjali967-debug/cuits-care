import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// GET /api/user/:email -> Get user profile by email
router.get('/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/user -> Create or update user profile
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    
    // If no email is provided, we can't save/update properly
    if (!email) {
      return res.status(400).json({ message: 'Email is required to identify the user.' });
    }

    // Find the user by email, and update, or create a new one if not found
    const user = await User.findOneAndUpdate(
      { email },
      req.body,
      { new: true, upsert: true } // upsert: true creates a new document if one doesn't exist
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
