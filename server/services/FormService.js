const FormModel = require('../db/Form');
const UserModel = require('../db/User');
const CourseModel = require('../db/Course');
const ResponseModel = require('../db/Response');

async function checkAuthorization(req) {
  let form = await FormModel.findOne({ _id: req.params.formId });
  let course = await CourseModel.findOne({ _id: form.course });
  if (course.createdBy != req.user._id) {
    throw new Error('You are not the owner of the form');
  }
}

module.exports = {
  createForm: async (req, res) => {
    try {
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
          .then(() => {
            console.log('Form id added to user deeatils');
          })
          .catch((error) => console.log(error));
        res.status(200).json(docs);
      });
    } catch (error) {
      res.send(error);
    }
  },

  getFormById: async (req, res) => {
    try {
      var formId = req.params.formId;

      await FormModel.findOne({ _id: formId }).then(async (form) => {
        if (form == null) {
          res.status(404).send('Form not found');
        } else {
          res.status(200).json(form);
        }
      });
    } catch (error) {
      res.send(error);
    }
  },

  deleteForm: async (req, res) => {
    try {
      var formId = req.params.formId;
      var userId = req.params.userId;

      await checkAuthorization(req);

      console.log(formId);
      console.log(userId);

      await FormModel.findOne({ _id: formId }).then(async (form) => {
        form.remove(function (err) {
          if (err) {
            return res.status(500).send(err);
          }
          console.log('Form deleted');
          return res.status(202).send('Form Deleted');
        });
      });
    } catch (error) {
      return res.status(401).send(error.message);
    }
  },

  editForm: async (req, res) => {
    try {
      var formId = req.body.formId;
      var data = {
        name: req.body.name,
        description: req.body.description,
        questions: req.body.questions,
      };

      await checkAuthorization(req);

      console.log('Hi, I am from backend, this is form data that i recivied');

      console.log(data);

      FormModel.findByIdAndUpdate(formId, data, { new: true }, (err, result) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(200).json(result);
        }
      });
    } catch (error) {
      res.status(401).send(error.message);
    }
  },

  submitResponse: async (req, res) => {
    try {
      var data = {
        formId: req.body.formId,
        user: req.user.name,
        userId: req.user._id,
        response: req.body.response,
      };
      console.log(data.formId);
      console.log(data.userId);

      if (data.response.length > 0) {
        var newResponse = new ResponseModel(data);
        // console.log(newResponse);

        await newResponse.save().then((docs) => {
          res.status(200).json(docs);
        });
      } else {
        res.status(400).send('FIll atleast one field, MF!');
      }
    } catch (error) {
      res.send(error);
    }
  },

  getResponse: async (req, res) => {
    try {
      var formId = req.params.formId;

      await checkAuthorization(req);

      await ResponseModel.find({ formId: formId }).then(async (responses) => {
        res.status(200).json(responses);
      });
    } catch (error) {
      res.send(error.message);
    }
  },

  getMyResponse: async (req, res) => {
    var formId = req.params.formId;
    console.log('hey');
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
