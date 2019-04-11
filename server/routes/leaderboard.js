import express from 'express';

const router = express.Router();

router.get('/leaderboard', (req,res) => {
  res.send({});
});

export default router;