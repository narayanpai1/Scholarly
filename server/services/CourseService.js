const CourseModel = require('../db/Course');
const FormModel = require('../db/Form');

var ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
  /***
   * A service to create a new course.
   * Should be only requested by a teacher.
   * Else sends an error.
   */
  createCourse: async (req, res) => {
    try {
      if(req.user.isStudent){
        throw 'Not authorized';
      }

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
      res.status(409).send(error);
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
    try {
      await CourseModel.find().then(async (courses) => {
        return res.status(200).json(courses);
      });
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  /***
   * Deletes the course of given id.
   * 
   * If the requested user is not the owner of the course,
   * sends error message.
   */
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


  /***
   * Gets different tests of the course of given id.
   */
  getAllFormsOfCourse: async (req, res) => {
    try {
      var courseId = req.params.courseId;
      var query = { course: new ObjectId(courseId) };
      await FormModel.find(query).then(async (forms) => {

        // compute the total marks here itself so that it can be used everywhere
        forms = forms.map((form)=>{
          form = form.toObject();
          form.totalMarks = 0;
          form.questions.forEach((question) => {
            form.totalMarks += question.marks;
          });

          return form;
        });

        return res.status(200).json(forms);
      });
    } catch (err) {
      return res.status(500).send(err);
    }
  },
};
