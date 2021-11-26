const CourseModel = require('../db/Course');
const UserModel = require('../db/User');
const FormModel = require('../db/Form');

var ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
  createCourse: async (req, res) => {
    try {
      var data = {
        createdBy: req.user._id,
        name: req.body.name,
        description: req.body.description,
      };

      if (req.body.url != '') {
        data.url = req.body.url;
      }
      var newCourse = new CourseModel(data);
      await newCourse.save().then((docs) => {
        res.status(200).json(docs);
      });
    } catch (error) {
      res.send(error);
    }
  },

  getCourseById: async (req, res) => {
    try {
      var courseId = req.params.courseId;

      await CourseModel.findOne({ _id: courseId }).then(async (course) => {
        if (course == null) {
          res.status(404).send('Course not found');
        } else {
          res.status(200).json(course);
        }
      });
    } catch (error) {
      res.send(error);
    }
  },

  getAllCourses: async (req, res) => {
    var filters = {};

    if (req.query.created === 'true') {
      filters = {
        createdBy: req.user._id,
      };
    }

    try {
      await CourseModel.find(filters).then(async (courses) => {
        return res.status(200).json(courses);
      });
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  deleteCourse: async (req, res) => {
    try {
      var courseId = req.params.courseId;

      await CourseModel.findOne({ _id: courseId }).then(async (course) => {
        if (course == null) {
          res.status(404).send('Course not found or already deleted');
        } else {
          if (course.createdBy === req.user._id) {
            course.remove(function (err) {
              if (err) {
                return res.status(500).send(err);
              }
              console.log('Course deleted');
              return res.status(202).send('Course Deleted');
            });
          } else {
            res.status(401).send('You are not the owner of this Course');
          }
        }
      });
    } catch (error) {
      return res.status(500).send(error);
    }
  },

  getAllFormsOfCourse: async (req, res) => {
    try {
      var courseId = req.params.courseId;
      var query = { course: new ObjectId(courseId) };
      await FormModel.find(query).then(async (courses) => {
        return res.status(200).json(courses);
      });
    } catch (err) {
      return res.status(500).send(err);
    }
  },
};
