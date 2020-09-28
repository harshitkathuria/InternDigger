const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const userRouter = require('./routes/userRouter');
const vacancyRouter = require('./routes/vacancyRouter');
const responseRouter = require('./routes/responseRouter');
const viewsRouter = require('./routes/viewsRouter');
const errorHandler =  require('./controllers/errorController');

const app = express();

app.enable('trust proxy');

// Parser JSON
app.use(express.json());
app.use(express.urlencoded({ limit: '10kb', extended: true }));
// Set cookie on req
app.use(cookieParser());

// // Handle CORS
// app.use(cors());

// app.options('*', cors());

// const limit = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 60,
//   message: 'Too many request with thi IP Address..Try again in 1 hour'
// });

// app.use('/interndigger/api', limit);

if(process.env.NODE_ENV === 'development')
  app.use(morgan('dev'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
  
app.use(express.static(path.join(__dirname, 'public')));

app.use(compression());

app.use('/', viewsRouter);
app.use('/interndigger/api/v1/users', userRouter);
app.use('/interndigger/api/v1/vacancy', vacancyRouter);
app.use('/interndigger/api/v1/response', responseRouter);

app.all('*', (req, res) => {
  res.status(400).json({
    status: 'fail',
    message: `Cannot find ${req.originalUrl}`
  })
});

app.use(errorHandler);

module.exports = app;