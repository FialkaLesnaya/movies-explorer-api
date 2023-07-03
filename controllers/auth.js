const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { CREATION_SUCCESS_CODE } = require('../utils/utils');

const { NODE_ENV = 'production', JWT_SECRET_KEY = 'JWT_SECRET_KEY' } = process.env;
const IsExistError = require('../errors/isExistError');
const NotCorrectValueError = require('../errors/notCorrectValueError');
const AuthError = require('../errors/authError');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return next(new AuthError('Не верно указан логин или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return next(new AuthError('Не верно указан логин или пароль'));
          }
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET_KEY : 'dev-secret',
            { expiresIn: '7d' },
          );

          res.body = { token };

          return res.send({ token });
        });
    })
    .catch((error) => next(error));
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  return User.findOne({ email }).then((existingUser) => {
    if (existingUser) {
      return next(new IsExistError());
    }

    return bcrypt.hash(password, 10)
      .then((hash) => User.create({
        name,
        email,
        password: hash,
      }))
      .then((user) => res.status(CREATION_SUCCESS_CODE).send({
        _id: user._id,
        name: user.name,
        email: user.email,
      }));
  })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new NotCorrectValueError());
      }

      return next(error);
    });
};
