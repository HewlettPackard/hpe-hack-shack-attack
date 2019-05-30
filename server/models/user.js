/* (C) Copyright 2019 Hewlett Packard Enterprise Development LP. */
import mongoose from 'mongoose';
const userSchema = mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String},
  initials: {type: String, required: true},
  score: {type: Number, required: true},
});

const User = mongoose.model('User', userSchema);

export default User;