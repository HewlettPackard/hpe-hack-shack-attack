import mongoose, {Schema} from 'mongoose';

const leaderboardSchema = mongoose.Schema({
  score: {type: String, required: true},
  user: {type: Schema.Types.ObjectId, ref: 'User'},
});

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);

export default Leaderboard;