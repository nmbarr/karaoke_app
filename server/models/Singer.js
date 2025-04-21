import mongoose from 'mongoose';

const singerSchema = new mongoose.Schema({
  name: String,
  songTitle: String,
  artist: String,
  status: { type: String, default: 'waiting' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Singer', singerSchema);
