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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Box from '@mui/material/Box';
import NavigBar from '../NavigBar';

const useStyles = makeStyles((theme) => ({}));

function Responded(props) {
  const classes = useStyles();
  let { formData, responseData } = props;
  const [maxMarks, setMaxMarks] = React.useState(null);
  const [totalObtainedMarks, setTotalObtainedMarks] = React.useState(null);
  const [perQuestionData, setPerQuestionData] = React.useState(null);

  React.useEffect(() => {
    if (!responseData) return;

    let perQuestionDataTemp = [],
      maxMarksTemp = 0,
      totalObtainedMarksTemp = 0;

    formData.questions.forEach((question, i) => {
      var selectedOp = responseData.response.filter((qss) => qss.questionId === question._id);

      let markedOptions = '',
        correctAnswers = 0,
        correctOptions = '',
        actualCorrectAnswers = 0,
        flag = 0,
        marksObtained = 0;

      if (selectedOp.length > 0) {
        formData.questions[i].options.forEach((oo, index) => {
          if (selectedOp[0].optionId.includes(oo._id)) {
            if (markedOptions) {
              markedOptions += ', ';
            }
            markedOptions += String.fromCharCode('A'.charCodeAt(0) + index);

            if (oo.isCorrect) {
              correctAnswers += 1;
            } else {
              flag = 1;
            }
          }
        });
      }

      formData.questions[i].options.forEach((oo, index) => {
        if (oo.isCorrect) {
          actualCorrectAnswers += 1;

          if (correctOptions) {
            correctOptions += ', ';
          }
          correctOptions += String.fromCharCode('A'.charCodeAt(0) + index);
        }
      });

      if (!markedOptions) {
        markedOptions = 'None';
      }

      if (flag === 1) {
        correctAnswers = 0;
      }

      marksObtained = (correctAnswers * formData.questions[i].marks) / actualCorrectAnswers;
      totalObtainedMarksTemp += marksObtained;
      maxMarksTemp += formData.questions[i].marks;

      perQuestionDataTemp.push({ markedOptions, correctOptions, marksObtained });
    });
    setMaxMarks(maxMarksTemp);
    setTotalObtainedMarks(totalObtainedMarksTemp);
    setPerQuestionData(perQuestionDataTemp);
  }, [responseData, formData]);

  return (
    <div style={{ marginLeft: '15px' }}>
      <Grid>
        {totalObtainedMarks !== null && (
          <div style={{ textAlign: 'left' }}>
            <h3>Summary</h3>
            Maximum Marks: &nbsp; {maxMarks}
            <br />
            Marks Secured: &nbsp;{totalObtainedMarks.toPrecision(2)}
            <br />
          </div>
        )}
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

                  <div style={{ marginLeft: '20px', fontSize: '10px' }}>
                    {perQuestionData !== null && (
                      <div
                        style={{
                          color: '#666666',
                          fontSize: '12px',
                          marginLeft: '13px',
                          textAlign: 'left',
                        }}
                      >
                        Maximum Marks: {ques.marks}
                        <br />
                        Secured Marks: {perQuestionData[i].marksObtained.toPrecision(2)}
                        <br />
                      </div>
                    )}
                    <FormGroup>
                      {ques.options.map((op, j) => (
                        <div key={j}>
                          <div style={{ display: 'flex' }}>
                            <FormControlLabel
                              disabled
                              control={
                                <Checkbox
                                  checked={
                                    perQuestionData !== null &&
                                    perQuestionData[i].markedOptions.includes(
                                      String.fromCharCode('A'.charCodeAt(0) + j),
                                    )
                                  }
                                  value={op._id}
                                />
                              }
                              label={
                                String.fromCharCode('A'.charCodeAt(0) + j) + '. ' + op.optionText
                              }
                            />
                            {perQuestionData !== null &&
                              perQuestionData[i].correctOptions.includes(
                                String.fromCharCode('A'.charCodeAt(0) + j),
                              ) && (
                              <Box sx={{ color: 'green', fontSize: '13px' }}>
                                <CheckCircleIcon fontSize="small" sx={{ marginTop: '10px' }} />
                                  Expected Answer
                              </Box>
                            )}
                          </div>

                          <div style={{ display: 'flex' }}>
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
      </Grid>
    </div>
  );
}

export default Responded;