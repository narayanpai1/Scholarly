import React from 'react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import formService from '../../services/formService';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import Snackbar from '@mui/material/Snackbar';


/***
 * The component shown when the user is responding to the test.
 * 
 * It lets the user select different options and submit the test.
 * On submitting the test, the same component shows a success page.
 */
function Responding(props) {
  let { formData } = props;
  const [responseData, setResponseData] = React.useState([]);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [timeRemaining, setTimeRemaining] = React.useState('');
  const [sendingResponse, setSendingResponse] = React.useState(false);
  const [timedOut, setTimedOut] = React.useState(false);
  const [serverTime,setServerTime] = React.useState(null);

  const handleRadioChange = (j, i) => {
    var optionId = j;
    var responseDataTemp = [...responseData];
    const index = responseDataTemp[i].optionId.indexOf(j);

    if (index > -1) {
      responseDataTemp[i].optionId.splice(index, 1);
    } else {
      responseDataTemp[i].optionId.push(optionId);
    }
    setResponseData(responseDataTemp);
  };

  React.useEffect(() => {
    if (!formData) return;

    var responseDataTemp = [];

    // calculate the initial difference between the server and the client
    // so that we can use the client time from here on
    // If the client updates the time while giving a test, not our fault :(
    let serverTime = new Date(formData.currentServerTime),
      clientTime = new Date(),
      initialServerClientTimeDifference = (serverTime.getTime() - clientTime.getTime());
    console.log(formData.currentServerTime);
    console.log(initialServerClientTimeDifference);

    var timeRefresh = setInterval(async () => {
      let dt1 = new Date();
      let dt2 = new Date(formData.endTime);

      let diff = (dt2.getTime() - (dt1.getTime() + initialServerClientTimeDifference)) / 1000;

      // update the server time based on initial difference
      // we cant keep fetching the server time
      let serverTime = new Date(dt1.getTime() + initialServerClientTimeDifference);
      serverTime = serverTime.toLocaleTimeString('en-US', { timeZoneName: 'short' });
      setServerTime(serverTime);

      if (diff < -5) {
        setTimeRemaining('Time Over');
        setServerTime(null);
        setTimedOut(true);
        return;
      }
      if(diff<=0){
        setTimeRemaining('');
        await setSendingResponse(true);
        clearInterval(timeRefresh);
        return;
      }

      let days = Math.floor(diff / (24 * 3600));
      diff %= 24 * 3600;
      let hours = Math.floor(diff / 3600);
      diff %= 3600;
      let mins = Math.floor(diff / 60);
      diff %= 60;
      let secs = Math.floor(diff);

      let diffString = 'Time Remaining: ';
      if (days) {
        diffString += days + ' days ';
      }
      if (hours) {
        diffString += hours + ' hours ';
      }
      if (mins) {
        diffString += mins + ' mins ';
      }
      if (secs) {
        diffString += secs + ' secs ';
      }
      setTimeRemaining(diffString);
    }, 1000);

    formData.questions.forEach((question) => {
      responseDataTemp.push({
        questionId: question._id,
        optionId: [],
      });
    });

    setResponseData(responseDataTemp);
  }, [formData]);

  function submitResponse() {
    var submissionData = {
      formId: formData._id,
      response: responseData,
    };
    
    formService.submitResponse(submissionData).then(
      () => {
        setIsSubmitted(true);
      },
      (error) => {
        const resMessage =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(error.message);
        setIsSubmitted(true);
        // if the message says something like a teacher cannot submit a response
        // redirect to error page
        if(resMessage.includes('teacher')){
          window.location.replace('/forbidden');
        }
      },
    );
  }

  React.useEffect(() =>{
    if(sendingResponse === true)
      submitResponse();
  },[sendingResponse]);

  function isMarkedOption(i, optionId) {
    if (responseData[i] && responseData[i].optionId.includes(optionId)) {
      return true;
    }
    return false;
  }

  function reload() {
    location.reload();
  }
  return !isSubmitted && !timedOut ? (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {formData && formData.totalMarks && (
          <div
            style={{
              margin: '10px 20px',
              padding: '2px 10px',
              borderRadius: '4px',
              backgroundColor: '#d9d9d9',
            }}
          >
            Maximum Marks: {formData.totalMarks}
          </div>
        )}
        {timeRemaining !== '' && (
          <div
            style={{
              margin: '10px 20px',
              borderRadius: '4px',
              padding: '2px 10px',
              backgroundColor: '#d9d9d9',
              textAlign:'left'
            }}
          >
            Server Time: {serverTime}
            <br/>
            {timeRemaining}
          </div>
        )}
      </div>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={sendingResponse}
        message="Submitting your response..."
        sx={{
          '.MuiSnackbarContent-root': {
            backgroundColor: 'green',
            fontSize: '18px',
          },
        }}
      />
      <Grid sx={{margin:'20px'}}>
        {formData.questions.map((ques, i) => (
          <div key={i}>
            <br></br>
            <Paper>
              <div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    marginLeft: '6px',
                    paddingTop: '15px',
                    paddingBottom: '15px',
                  }}
                >
                  <Typography variant="subtitle1" style={{ marginLeft: '10px' }}>
                    {i + 1}. {ques.questionText}
                  </Typography>

                  {ques.questionImage !== '' ? (
                    <div>
                      <img src={ques.questionImage} width="80%" height="auto" />
                      <br></br>
                      <br></br>
                    </div>
                  ) : (
                    ''
                  )}

                  <div
                    style={{
                      color: '#666666',
                      fontSize: '12px',
                      marginLeft: '25px',
                      textAlign: 'left',
                    }}
                  >
                    Marks: {ques.marks}
                  </div>
                  <div>
                    <FormGroup
                      onChange={(e) => {
                        handleRadioChange(e.target.value, i);
                      }}
                    >
                      {ques.options.map((op, j) => (
                        <div key={j}>
                          <div style={{ display: 'flex', marginLeft: '7px' }}>
                            <FormControlLabel
                              control={
                                <Checkbox checked={isMarkedOption(i, op._id)} value={op._id} />
                              }
                              label={
                                String.fromCharCode('A'.charCodeAt(0) + j) + '. ' + op.optionText
                              }
                            />
                          </div>

                          <div style={{ display: 'flex', marginLeft: '10px' }}>
                            {op.optionImage !== '' ? (
                              <img src={op.optionImage} width="64%" height="auto" />
                            ) : (
                              ''
                            )}
                            <Divider />
                          </div>
                        </div>
                      ))}
                    </FormGroup>
                  </div>
                </div>
              </div>
            </Paper>
          </div>
        ))}
        <br></br>
        <div style={{ display: 'flex' }}>
          <Button variant="contained" color="primary" onClick={submitResponse}>
            Submit
          </Button>
        </div>
        <br></br>
      </Grid>
    </div>
  ) : (
    <div>
      {isSubmitted && (
        <>
          <Typography variant="body1">Answers submitted</Typography>
          <Typography variant="body2">Thanks for submiting the test</Typography>
          <Button onClick={reload}>Review Submission</Button>
        </>
      )}
      {timedOut && (
        <>
          <Typography variant="body1">The submission time is over :\</Typography>
          <Button href="/home">Go to Dashboard</Button>
        </>
      )}
    </div>
  );
}

export default Responding;
