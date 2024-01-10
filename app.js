const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path')
const users = require('./routes/users');
require('dotenv').config({ path: path.join(__dirname, ".env") });
const app = express();


const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const process = require('process');



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  next();
});


app.use('/api/users', users);

const db = 'mongodb://localhost:27017/users';
mongoose
  .connect(db, {
    useNewUrlParser: true,
  })
  .then(console.log('MongoDB connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT;
if (cluster.isPrimary && (process.env.CLUSTER + "").trim() == 'TRUE') {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`server runs at port ${PORT}`);
  });
}

