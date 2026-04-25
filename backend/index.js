import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
// Resolve __dirname since we are using ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React frontend build
const buildPath = path.join(__dirname, '../dist');
app.use(express.static(buildPath));

// Routes
app.use('/api/user', userRoutes);

// Handle any requests that don't match the API routes by returning the React app
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// Database & Server initialization
const startServer = async () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });

  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/cuits-care";
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
  }
};

startServer();
