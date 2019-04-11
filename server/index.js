require('dotenv').config();
require('babel-register');

// Start up DB Server
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/default', { useNewUrlParser: true });

require('./models/user');
require('./models/leaderboard');

// Fire server up at port
require('./app.js').start(process.env.PORT || 3002);