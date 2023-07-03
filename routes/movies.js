const router = require('express').Router();
const { validateMovieBody, validateMovieId } = require('../utils/validators');
const {
  getSavedMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/movies', getSavedMovies);
router.post('/movies', validateMovieBody, createMovie);
router.delete('/movies/:movieId', validateMovieId, deleteMovie);

module.exports = router;
