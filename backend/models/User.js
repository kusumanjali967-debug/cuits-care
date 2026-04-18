import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  skinType: { type: String, default: "Unknown" },
  skinIssues: { type: [String], default: [] },
  currentProducts: [{
    id: { type: Number },
    name: { type: String }
  }],
  morningRoutine: [{
    id: { type: Number },
    name: { type: String },
    completed: { type: Boolean, default: false }
  }]
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);
