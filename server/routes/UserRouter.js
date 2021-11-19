var router = require('express').Router();
const UserService = require('../services/UserService');
const check_auth = require('../middleware/check_auth');

router.route('/login').post(UserService.login);
router.route('/signup').post(UserService.signup);
router.route('/googleLogin').post(UserService.loginFromGoogle);

router.use('', check_auth);
router.route('').get(UserService.getUser);
router.route('').put(UserService.editUser);

module.exports = router;
