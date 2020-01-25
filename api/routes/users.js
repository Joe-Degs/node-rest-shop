const express = require('express');
const router = express.Router();
const checkAuth = require('../auth/check-auth');
const UsersController = require('../controllers/user');


router.post('/signup', UsersController.create_new_user);

router.post('/login', UsersController.login_user);

router.delete('/:userId', checkAuth, UsersController.delete_user);


module.exports = router;