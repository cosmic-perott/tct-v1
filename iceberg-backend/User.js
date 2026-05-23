import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isPremium: { type: Boolean, default: false }
});

// This is the line that fixes your server crash:
export default mongoose.model('User', UserSchema);
