const router = require('express').Router();
const { validateUserInfo } = require('../utils/validators');
const {
  getUsersMe,
  updateUser,
} = require('../controllers/users');

router.get('/me', getUsersMe);
router.patch('/me', validateUserInfo, updateUser);

module.exports = router;
