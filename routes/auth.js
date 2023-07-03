const router = require('express').Router();
const { validateAuthentication, validateUserBody } = require('../utils/validators');
const {
  login,
  createUser,
} = require('../controllers/auth');

router.post('/signin', validateAuthentication, login);
router.post('/signup', validateUserBody, createUser);

module.exports = router;
