const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const { authMiddleware } = require('./middlewares/auth');
require('dotenv').config();

const { PORT = 3000, DB_ADDRESS = 'mongodb://127.0.0.1/bitfilmsdb' } = process.env;
const NotFoundError = require('./errors/notFoundError');

const app = express();

// const corsOptions = {
//   origin: ['https://listik-fialki.nomoredomains.rocks', 'http://listik-fialki.nomoredomains.rocks'],
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// };

// app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

// Apply the rate limiting middleware to all requests
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}));

mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
});

app.use((_, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

app.use(cookieParser());
// app.use(requestLogger);
app.use('/', require('./routes/auth'));

app.use(authMiddleware);
app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.use((_, __, next) => next(new NotFoundError('Недействительный путь')));
// app.use(errorLogger);
app.use(errors());
// app.use(errorMiddleware);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
