const router = require('express').Router();
const { validateUserDetails } = require('../utils/validators');
const {
  getUsersMe,
  updateUser,
} = require('../controllers/users');

router.get('/me', getUsersMe);
router.patch('/me', validateUserDetails, updateUser);

module.exports = router;
