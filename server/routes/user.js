import express from 'express';
import User from '../models/user.js';

const router = express.Router();

// Get users record
router.get('/user/leaderboard', (req,res) => {
  User.find()
    .then( users => res.send(users))
    .catch( err => {
      res.send(err); 
    }); 
});

// Create User
router.post('/user/create', (req, res) => {
  return User.create(req.body)
    .then(user => res.send(user))
    .catch(err => res.send(err));
});

export default router;