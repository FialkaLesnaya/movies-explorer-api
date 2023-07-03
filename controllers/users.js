const User = require('../models/user');

const NotFoundError = require('../errors/notFoundError');

module.exports.getUsersMe = (req, res, next) => {
  const userId = req.user._id;

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователя не существует'));
      }

      return res.send({
        email: user.email,
        name: user.name,
      });
    })
    .catch((error) => next(error));
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  const userId = req.user._id;

  return User.findByIdAndUpdate(userId, { email, name }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователя не существует'));
      }

      return res.send({ data: user });
    })
    .catch((error) => next(error));
};
