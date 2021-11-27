import React from 'react';

import Grid  from '@mui/material/Grid';
import Typography  from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Box from '@mui/material/Box';

/***
 * The component shown when the user has already responded to the test.
 * 
 * It shows the users response along with the scores and correct options for each of the question.
 */
function Responded(props) {
  let { formData, responseData } = props;
  const [totalObtainedMarks, setTotalObtainedMarks] = React.useState(null);
  const [perQuestionData, setPerQuestionData] = React.useState(null);

  React.useEffect(() => {
    if (!responseData) return;

    let perQuestionDataTemp = [],
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

      perQuestionDataTemp.push({ markedOptions, correctOptions, marksObtained });
    });
    setTotalObtainedMarks(totalObtainedMarksTemp);
    setPerQuestionData(perQuestionDataTemp);
  }, [responseData, formData]);

  return (
    <div style={{ marginLeft: '15px' }}>
      <Grid>
        {totalObtainedMarks !== null && (
          <div style={{ textAlign: 'left' }}>
            <h3>Summary</h3>
            Maximum Marks: &nbsp; {formData.totalMarks}
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
