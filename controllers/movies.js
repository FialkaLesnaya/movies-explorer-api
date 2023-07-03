const Movie = require('../models/movie');
const { CREATION_SUCCESS_CODE } = require('../utils/utils');
const NotFoundError = require('../errors/notFoundError');
const NoAccessError = require('../errors/noAccessError');
const NotCorrectValueError = require('../errors/notCorrectValueError');

module.exports.getSavedMovies = (req, res, next) => {
  const userId = req.user._id;

  return Movie.find({ owner: userId })
    .then((movies) => res.send({ data: movies }))
    .catch((error) => next(error));
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const userId = req.user._id;

  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: userId,
  })
    .then((movie) => res.status(CREATION_SUCCESS_CODE).send({ data: movie }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new NotCorrectValueError());
      }

      return next(error);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const userId = req.user._id;

  return Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        return next(new NotFoundError('Фильм не найден'));
      }

      if (movie.owner.toString() !== userId) {
        return next(new NoAccessError('Карточка не была создана вами'));
      }

      return Movie.deleteOne(movie).then(() => res.send({ data: movie }));
    })
    .catch((error) => next(error));
};
