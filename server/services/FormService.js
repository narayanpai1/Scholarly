const FormModel = require('../db/Form');
const UserModel = require('../db/User');
const CourseModel = require('../db/Course');
const ResponseModel = require('../db/Response');

/***
 * Checks if the user is the creator of the
 * form(ie of the course the form is present in)
 */
async function checkAuthorization(req) {
  let form = await FormModel.findOne({ _id: req.params.formId });
  let course = await CourseModel.findOne({ _id: form.course });
  if (course.createdBy != req.user._id) {
    throw new Error('You are not the owner of the form');
  }
}

module.exports = {
  /***
   * Creates a new test under the course
   * If the user is not the owner of the course, sends an error message
   */
  createForm: async (req, res) => {
    try {
      let course = await CourseModel.findOne({ _id: req.body.course });

      if (course.createdBy != req.user._id) {
        throw 'Not authorized';
      }

      var data = {
        name: req.body.name,
        description: req.body.description,
        course: req.body.course,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
      };

      var newForm = new FormModel(data);
      await newForm.save().then((docs) => {
        UserModel.updateOne({ _id: data.createdBy }, { $push: { createdForms: docs._id } })
          .then(() => {})
          .catch((error) => console.log(error));
        res.status(200).json(docs);
      });
    } catch (error) {
      res.status(401).send(error);
    }
  },

  getFormById: async (req, res) => {
    try {
      var formId = req.params.formId;

      await FormModel.findOne({ _id: formId }).then(async (form) => {
        if (form == null) {
          res.status(404).send('Form not found');
        } else {
          form = form.toObject();
          // compute the total marks here itself so that it can be used everywhere
          let totalMarks = 0;
          form.questions.forEach((question)=>{
            totalMarks+=question.marks;
          });
          form.totalMarks = totalMarks;

          // send the current server time as we validate the time left by the server time
          // and not the client time
          form.currentServerTime = new Date();

          res.status(200).json(form);
        }
      });
    } catch (error) {
      res.send(error);
    }
  },

  // sends error if the user is not the owner
  deleteForm: async (req, res) => {
    try {
      var formId = req.params.formId;

      await checkAuthorization(req);

      await FormModel.findOne({ _id: formId }).then(async (form) => {
        form.remove(function (err) {
          if (err) {
            return res.status(500).send(err);
          }
          return res.status(202).send('Form Deleted');
        });
      });
    } catch (error) {
      return res.status(401).send(error.message);
    }
  },

  // sends error if the user is not the owner
  editForm: async (req, res) => {
    try {
      var formId = req.body._id;
      var data = {
        name: req.body.name,
        description: req.body.description,
        questions: req.body.questions,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
      };

      await checkAuthorization(req);

      FormModel.findByIdAndUpdate(formId, data, { new: true }, (err, result) => {
        console.log(err);
        if (err) {
          res.status(500).send(err);
        } else {
          console.log(result);
          res.status(200).json(result);
        }
      });
    } catch (error) {
      res.status(401).send(error.message);
    }
  },

  submitResponse: async (req, res) => {
    try {
      let oldResponses = await ResponseModel.find({
        formId: req.body.formId,
        userId: req.user._id,
      });

      // not an error since a user might sometimes click on submit button multiple times
      if (oldResponses.length > 0) return res.status(200).json({ message: 'Already submitted' });

      if (!req.user.isStudent) throw 'A teacher cannot attempt a test';

      let form = await FormModel.findOne({ _id: req.body.formId });

      let currentTime = new Date(),
        endTime = new Date(form.endTime);

      // 20 seconds buffer for time taken for network call, reading database etc
      if (currentTime.getTime() > endTime.getTime() + 20) {
        throw 'Late submission';
      }

      var data = {
        formId: req.body.formId,
        user: req.user.name,
        userId: req.user._id,
        response: req.body.response,
      };

      var newResponse = new ResponseModel(data);

      await newResponse.save().then((docs) => {
        res.status(200).json(docs);
      });
    } catch (error) {
      console.log(error);
      res.status(401).json({message:error});
    }
  },

  /***
   * Gets all the responses of a test.
   * 
   * Requires the user to be the owner of the test and hence the course
   */
  getResponse: async (req, res) => {
    try {
      var formId = req.params.formId;

      await checkAuthorization(req);

      await ResponseModel.find({ formId: formId }).then(async (responses) => {
        res.status(200).json(responses);
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  getMyResponse: async (req, res) => {
    var formId = req.params.formId;

    ResponseModel.findOne({ formId: formId, userId: req.user._id })
      .then((response) => {
        if (!response) response = {};
        res.status(200).json(response);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  },
};
