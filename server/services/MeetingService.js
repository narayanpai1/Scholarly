const bbb = require('bigbluebutton-js');
const http = bbb.http;
const CourseModel = require('../db/Course');
const MeetingModel = require('../db/Meeting');
const { BBB_URL, BBB_SECRET } = require('../config');

let api = bbb.api(BBB_URL, BBB_SECRET);

function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = {
  createMeeting: async (req, res) => {
    try {
      let course = await CourseModel.findOne({ _id: req.body.course });
      if (course.createdBy != req.user._id) {
        throw 'Not authorized';
      }

      let meeting = {
        course: req.body.course,
        name: req.body.name,
        attendeePassword: makeid(6),
        moderatorPassword: makeid(6),
        record: req.body.record,
      };
      
      meeting = new MeetingModel(meeting);
      await meeting.save().then((newMeeting) => {
        try {
          let meetingCreateUrl = api.administration.create(newMeeting.name, newMeeting._id.toString(), {
            duration: 2,
            attendeePW: newMeeting.attendeePassword,
            moderatorPW: newMeeting.moderatorPassword,
            allowStartStopRecording: 'true',
            autoStartRecording: 'true',
            record: newMeeting.record,
          });

          http(meetingCreateUrl).then(async () => {
          
            let moderatorUrl = api.administration.join(
              req.user.name,
              newMeeting._id.toString(),
              newMeeting.moderatorPassword,
            );
            let attendeeUrl = api.administration.join(
              'attendee',
              newMeeting._id.toString(),
              newMeeting.attendeePassword,
            );
            console.log(`Moderator link: ${moderatorUrl}\nAttendee link: ${attendeeUrl}`);
            res.status(200).json({ link: moderatorUrl, meeting: meeting });
          } 
          );}
        catch (err) {
          res.status(401).send(err);
        }
      });
    } catch (err) {
      res.status(401).send(err);
    }
  },

  getMeetingLink: async (req, res) => {
    try {
      let meeting = await MeetingModel.findOne({ _id: req.params.meetingId });
      res.status(200).send({
        link: api.administration.join(
          req.user.name,
          req.params.meetingId,
          req.user.isStudent ? meeting.attendeePassword : meeting.moderatorPassword,
        ),
      });
      
    } catch (err) {
      res.status(401).send(err);
    }
  },

  getAllMeetingsOfCourse: async (req, res) => {
    try {
      let meetings = await MeetingModel.find({ course: req.params.courseId });
      let getMeetingsUrl = api.monitoring.getMeetings();
      let activeMeetings = await http(getMeetingsUrl);
      let link_meeting_record = api.recording.getRecordings();
      let recordedMeetings = await http(link_meeting_record);

      let resData = [];
      meetings.forEach((meeting) => {
        console.log(meeting);
        let link= api.administration.join(
          req.user.name,
          meeting._id.toString(),
          req.user.isStudent ? meeting.attendeePassword : meeting.moderatorPassword,
        );
          
        let recorded = false;
        let meetingActive = false;

        if (activeMeetings.meetings != '')
          activeMeetings.meetings.forEach((meet) => {
            if (meet.meetingID == meeting._id) {
              meetingActive = true;
            }
          });

        if (!meetingActive && recordedMeetings.recordings != ''){
          recordedMeetings.recordings.forEach((meet) => {
            if (meet.meetingID == meeting._id) {
              recorded = true;
              link =
                'https://scholarly-bbb.eastus.cloudapp.azure.com/playback/presentation/2.3/' +
                meet.recordID;
            }
          });
        }
    
        if(!meetingActive && !recorded){
          link = '';
        }

        resData.push({
          name: meeting.name,
          record: recorded,
          active: meetingActive,
          link: link
        });
      });

      res.status(200).send(resData);      
    } catch (err) {
      res.status(401).send(err);
    }
  },
};
