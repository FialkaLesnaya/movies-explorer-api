const { Joi, celebrate } = require('celebrate');
const { REG_EXP_URL } = require('./utils');

const validateUserInfo = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
});

const validateMovieBody = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().integer().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().pattern(REG_EXP_URL).required(),
    trailerLink: Joi.string().pattern(REG_EXP_URL).required(),
    thumbnail: Joi.string().pattern(REG_EXP_URL).required(),
    owner: Joi.string().required(),
    movieId: Joi.number().integer().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const validateMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  validateUserInfo,
  validateMovieBody,
  validateMovieId,
};
