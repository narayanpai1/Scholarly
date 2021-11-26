var router = require('express').Router();
const {
  createCourse,
  getCourseById,
  getAllCourses,
  deleteCourse,
  getAllFormsOfCourse,
} = require('../services/CourseService');

router.route('/:courseId').get(getCourseById);
router.route('').post(createCourse);
router.route('/:courseId').delete(deleteCourse);
router.route('').get(getAllCourses); // created=False
router.route('/forms/:courseId').get(getAllFormsOfCourse);

module.exports = router;
