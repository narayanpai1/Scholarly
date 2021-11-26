var router = require('express').Router();
const {
  createMeeting,
  getMeetingLink,
  getAllMeetingsOfCourse
} = require('../services/MeetingService');

router.route('').post(createMeeting);
router.route('/:meetingId').get(getMeetingLink);
router.route('/getAllMeetings/:courseId').get(getAllMeetingsOfCourse);

module.exports = router;
