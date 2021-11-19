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
import NavigBar from '../NavigBar';

const useStyles = makeStyles((theme) => ({}));

function UserView(props) {
  const classes = useStyles();

  const [formData, setFormData] = React.useState({});
  const [responseData, setResponseData] = React.useState([]);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [questions, setQuestions] = React.useState([]);

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
    if (!questions) return;

    var responseDataTemp = [];

    questions.forEach((question) => {
      responseDataTemp.push({
        questionId: question._id,
        optionId: [],
      });
    });

    setResponseData(responseDataTemp);
  }, [questions]);

  React.useEffect(() => {
    var formId = props.match.params.formId;

    formService.get(formId).then(
      (data) => {
        console.log(data);

        setFormData(data);
        setQuestions(data.questions);
      },
      (error) => {
        const resMessage =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(resMessage);
      },
    );
  }, [props.match.params.formId]);

  function submitResponse() {
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

  function reloadForAnotherResponse() {
    window.location.reload(true);
  }

  return (
    <>
      <NavigBar />
      <div style={{ minHeight: '100vh' }}>
        <div>
          <br />

          <Grid container direction="column" justify="center" alignItems="center">
            <Grid item xs={12} sm={5} style={{ width: '100%' }}>
              {/* <Grid style={{ borderTop: '10px solid teal', borderRadius: 10 }}>
              <div>
                <div>
                  <Paper elevation={2} style={{ width: '100%' }}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        marginLeft: '15px',
                        paddingTop: '20px',
                        paddingBottom: '20px',
                      }}
                    > */}
              <Typography
                variant="h4"
                style={{ fontFamily: 'sans-serif Roboto', marginBottom: '15px' }}
              >
                {formData.name}
              </Typography>
              <Typography variant="subtitle1">{formData.description}</Typography>
              {/* </div>
                  </Paper>
                </div>
              </div>
            </Grid> */}

              {!isSubmitted ? (
                <div>
                  <Grid>
                    {questions.map((ques, i) => (
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
                                            <Checkbox
                                              checked={isMarkedOption(i, op._id)}
                                              value={op._id}
                                            />
                                          }
                                          label={op.optionText}
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

                  <Button onClick={reloadForAnotherResponse}>Submit another response</Button>
                </div>
              )}
            </Grid>
          </Grid>

          {/* //TODO: Add a footer here */}
        </div>
      </div>
    </>
  );
}

export default UserView;

const FormControlLabelWrapper = (props) => {
  const { radioButton, ...labelProps } = props;
  return (
    <FormControlLabel
      control={<Radio />}
      label={'Radio ' + props.value + props.jIndex}
      {...labelProps}
    />
  );
};
