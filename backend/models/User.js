import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    required: false
  },
  skinType: {
    type: String,
    default: "Unknown"
  },
  skinIssues: {
    type: [String],
    default: []
  },
  currentProducts: {
    type: Array,
    default: []
  },
  morningRoutine: {
    type: Array,
    default: []
  },
  score: {
    type: Number,
    default: 0
  },
  history: {
    type: Array,
    default: []
  }
});

const User = mongoose.model("User", userSchema);

export default User;