import express from 'express';
import User from '../models/user.js';
import profanityList from '../profanity/profanityList.js';
import Filter from 'bad-words';

const router = express.Router();
const filter = new Filter();

filter.addWords(...profanityList);
// Get users record
router.get('/user/leaderboard', (req, res) => {
  User.find()
    .then( users => res.send(users))
    .catch( err => {
      res.send(err); 
    }); 
});

// Create User
router.post('/user/create', (req, res) => {
  const { initials, name } = req.body;
  let initialsProfanityCheck = filter.isProfane(initials);
  let nameProfanityCheck = filter.isProfane(name);
  if (initialsProfanityCheck || nameProfanityCheck) {
    res.status(403).send('Profanity not allowed');
  } else {
    return User.create(req.body)
      .then(user => res.send(user))
      .catch(err => res.send(err));
  }
});

export default router;