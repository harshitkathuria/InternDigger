const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => { 
  console.log(err.name, err.message);
  process.exit(1);
})

// Connecting env variables
if(process.env.NODE_ENV === 'develpoment')
  dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

// Connecting mongoose with our DB
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).then(() => console.log('Connection to DB estabilished'));


// Start server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Listening from port ${port}`)
});

//For handeling unhandled promise rejection
process.on('unhandledRejection', err => {
  // console.log(err.name, err.message);
  console.log('Unhandled Rejection!!! Shutting down...');
  server.close(() => {
      process.exit(1);
  });
})

//For handeling SIGTERM signal
process.on('SIGTERM', () => {
  console.log('SIGTERM Recieved...Shutting down gracefully..');
  server.close(() => {
      console.log('Process Terminated');
  })
})