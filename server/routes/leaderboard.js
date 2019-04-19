import express from 'express';
import {data} from '../seeder/data';

const router = express.Router();

router.get('/leaderboard', (req,res) => {
  res.send(data);
});

export default router;