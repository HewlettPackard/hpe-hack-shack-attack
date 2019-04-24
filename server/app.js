// Third Party Modules
import express from 'express';
import cors from 'cors';

var path = require('path');

// Our modules
import userRoutes from './routes/user';

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

app.get('/api/ping', (req, res) => {
  res.send('pong!');
});

app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname +'/index.html'));
});

// Model routes
app.use('/api', userRoutes);

let server = false;

module.exports = {
  start: (port) => {
    if(!server) {
      server = app.listen(port, (err) => {
        if(err) { throw err; }
        console.log('Server running on ' + port);
      });
    } else {
      console.log('Server is already running');
    }
  },
  stop: () => {
    server.close(() => {
      console.log('Server has closed');
    });
  },
  server: app,
};