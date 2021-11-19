var router = require('express').Router();

const check_auth = require('../middleware/check_auth');
const UserRouter = require('./UserRouter');
const FormRouter = require('./FormRouter');
const CourseRouter = require('./CourseRouter');

router.use('/user', UserRouter);
router.use('/form', check_auth, FormRouter);
router.use('/course', check_auth, CourseRouter);

router.get('/', (req, res) => {
  res.send('Router.js working fine');
});

module.exports = router;
