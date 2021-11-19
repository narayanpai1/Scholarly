var router = require('express').Router();
const {
  createForm,
  getFormById,
  deleteForm,
  editForm,
  submitResponse,
  getResponse,
} = require('../services/FormService');

router.route('/:formId').get(getFormById);
router.route('/addresponse').post(submitResponse);
router.route('').post(createForm);

router.route('/:formId').put(editForm);
router.route('/getresponse/:formId').get(getResponse);
router.route('/:formId').delete(deleteForm);
module.exports = router;
