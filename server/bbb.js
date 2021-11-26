const bbb = require('bigbluebutton-js');
let api = bbb.api(
  'https://scholarly-bbb.eastus.cloudapp.azure.com/bigbluebutton/',
  '78PTdCJyy6RnGwwZ1jlw27A5pRvpLwSJATLxlfPs0',
);
try{
  throw 'Hi';
}
catch(e){
  console.log(e);
}
let getMeetingsUrl = api.recording.getRecordings();
let http = bbb.http; 
async function a(){
  let res = await http(getMeetingsUrl);
  console.log(res);
}

a();
// [meeting name, id, 2 pws,record = true]

// // api module itself is responsible for constructing URLs
// // let meetingCreateUrl = api.administration.create('My Meeeweweewcwting', '31sxwwwwedweeew', {
// //   duration: 2,
// //   attendeePW: 'secret',
// //   moderatorPW: 'supersecret',
// //   allowStartStopRecording: 'true',
// //   autoStartRecording: 'true',
// //   record:'true'
// // });
// let meetingCreateUrl = api.recording.getRecordings();
// console.log(meetingCreateUrl);

// //  http method should be used in order to make calls
// http(meetingCreateUrl).then((result) => {
//   console.log(result);

//   let moderatorUrl = api.administration.join('moderator', '31sxwwwwedweeew', 'supersecret');
//   let attendeeUrl = api.administration.join('attendee', '31sxwwwwedweeew', 'secret');
//   console.log(`Moderator link: ${moderatorUrl}\nAttendee link: ${attendeeUrl}`);

//   let meetingEndUrl = api.administration.end('1', 'supersecret');
//   console.log(`End meeting link: ${meetingEndUrl}`);
// });