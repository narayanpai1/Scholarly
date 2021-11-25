import React from 'react';

import { Grid } from '@mui/material';

import { Paper, Typography } from '@mui/material';

import formService from '../../services/formService';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import RadioGroup from '@mui/material/RadioGroup';
import Divider from '@mui/material/Divider';
import { makeStyles } from '@mui/styles';

import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import Moment from 'react-moment';
import NavigBar from '../NavigBar';

const useStyles = makeStyles((theme) => ({}));

function Responding(props) {
  const classes = useStyles();
  let { formData } = props;
  const [responseData, setResponseData] = React.useState([]);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [timeRemaining, setTimeRemaining] = React.useState('');
  const [sendingResponse, setSendingResponse] = React.useState(false);

  const handleRadioChange = (j, i) => {
    var optionId = j;
    var responseDataTemp = [...responseData];
    console.log(j, i);
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
    console.log(formData);
    var responseDataTemp = [];

    setInterval(async () => {
      let dt1 = new Date();
      let dt2 = new Date(formData.endTime);
      console.log(dt2);

      let diff = (dt2.getTime() - dt1.getTime()) / 1000;
      // let diff = 0;
      if (diff < -5) {
        setTimeRemaining('Time Over');
        return;
      }
      if(diff<=0){
        setTimeRemaining('');
        await setSendingResponse(true);
        console.log(sendingResponse);
        submitResponse();
        return;
      }

      console.log(diff);
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
    setSendingResponse(true);
    var submissionData = {
      formId: formData._id,
      response: responseData,
    };
    console.log(submissionData);

    formService.submitResponse(submissionData).then(
      (data2) => {
        setIsSubmitted(true);
        console.log(data2);
      },
      (error) => {
        const resMessage =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(resMessage);
      },
    );
  }

  function isMarkedOption(i, optionId) {
    if (responseData[i] && responseData[i].optionId.includes(optionId)) {
      return true;
    }
    return false;
  }

  return !isSubmitted ? (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ margin: '10px 20px', padding: '2px 10px', backgroundColor: '#66ff33' }}>
          {timeRemaining}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div style={{ margin: '10px 20px', padding: '2px 10px', backgroundColor: '#66ff33' }}>
          {sendingResponse===true && (
            <>
              Submitting your response
            </>
          )}
        </div>
      </div>
      <Grid>
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
      </Grid>
      <Grid>
        <br></br>
        <div style={{ display: 'flex' }}>
          <Button variant="contained" color="primary" onClick={submitResponse}>
            Submit
          </Button>
        </div>
        <br></br>

        <br></br>
      </Grid>
    </div>
  ) : (
    <div>
      <Typography variant="body1">Form submitted</Typography>
      <Typography variant="body2">Thanks for submiting form</Typography>
      <Button href="/login">Go to Dashboard</Button>
    </div>
  );
}

export default Responding;
