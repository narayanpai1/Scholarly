var router = require('express').Router();
const {
  createMeeting,
  getAllMeetingsOfCourse
} = require('../services/MeetingService');

router.route('').post(createMeeting);
router.route('/getAllMeetings/:courseId').get(getAllMeetingsOfCourse);

module.exports = router;
