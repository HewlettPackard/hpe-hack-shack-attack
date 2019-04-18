import express from 'express';
import User from '../models/user.js';

const router = express.Router();

router.get('/user/leaderboard', (req,res) => {
  res.send({});
});

router.post('/user/create', (req, res) => {
  return User.create(req.body)
    .then(user => res.send(user));
});

export default router;