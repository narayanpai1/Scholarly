const bbb = require('bigbluebutton-js');
let api = bbb.api(
  'https://scholarly-bbb.eastus.cloudapp.azure.com/bigbluebutton/',
  '78PTdCJyy6RnGwwZ1jlw27A5pRvpLwSJATLxlfPs0',
);


let http = bbb.http;
// api module itself is responsible for constructing URLs
let meetingCreateUrl = api.administration.create('My Meeting', '1', {
  duration: 2,
  attendeePW: 'secret',
  moderatorPW: 'supersecret',
});

console.log(meetingCreateUrl);

// http method should be used in order to make calls
http(meetingCreateUrl).then((result) => {
  console.log(result);

  let moderatorUrl = api.administration.join('moderator', '1', 'supersecret');
  let attendeeUrl = api.administration.join('attendee', '1', 'secret');
  console.log(`Moderator link: ${moderatorUrl}\nAttendee link: ${attendeeUrl}`);

  let meetingEndUrl = api.administration.end('1', 'supersecret');
  console.log(`End meeting link: ${meetingEndUrl}`);
});