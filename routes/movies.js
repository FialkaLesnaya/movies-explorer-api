const router = require('express').Router();
const { validateMovieBody, validateMovieId } = require('../utils/validators');
const {
  getSavedMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getSavedMovies);
router.post('/', validateMovieBody, createMovie);
router.delete('/:movieId', validateMovieId, deleteMovie);

module.exports = router;
