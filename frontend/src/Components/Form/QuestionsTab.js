import React from 'react';
import { Grid } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { Paper, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CropOriginalIcon from '@mui/icons-material/CropOriginal';
import CloseIcon from '@mui/icons-material/Close';
import Radio from '@mui/material/Radio';
import MenuItem from '@mui/material/MenuItem';
import CheckCircle from '@mui/icons-material/CheckCircle';

import FormControlLabel from '@mui/material/FormControlLabel';
import AccordionActions from '@mui/material/AccordionActions';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FilterNoneIcon from '@mui/icons-material/FilterNone';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ImageUplaodModel from './ImageUplaodModel';
import formService from '../../services/formService';
import CircularProgress from '@mui/material/CircularProgress';
import SaveIcon from '@mui/icons-material/Save';

const marks = [
  { value: 1, label: '1 mark' },
  { value: 2, label: '2 marks' },
  { value: 3, label: '3 marks' },
  { value: 4, label: '4 marks' },
  { value: 5, label: '5 marks' },
];
function QuestionsTab(props) {
  const [questions, setQuestions] = React.useState([]);
  const [openUploadImagePop, setOpenUploadImagePop] = React.useState(false);
  const [imageContextData, setImageContextData] = React.useState({ question: null, option: null });
  const [formData, setFormData] = React.useState({});
  const [loadingFormData, setLoadingFormData] = React.useState(true);

  React.useEffect(() => {
    if (props.formData.questions !== undefined) {
      if (props.formData.questions.length === 0) {
        setQuestions([
          {
            questionText: 'Question',
            marks: 1,
            options: [{ optionText: 'Option 1', isCorrect: false }],
            open: false,
          },
        ]);
      } else {
        setQuestions(props.formData.questions);
      }
      setLoadingFormData(false);
    }
    setFormData(props.formData);
  }, [props.formData]);

  function saveQuestions() {
    console.log('auto saving questions initiated');
    var data = {
      formId: formData._id,
      name: formData.name,
      description: formData.description,
      questions: questions,
    };

    expandCloseAll();

    var errors = 0;
    questions.forEach((ques) => {
      var flag = 0;
      ques.options.forEach((opt) => {
        if (opt.isCorrect) flag = 1;
      });

      if (flag == 0) {
        ques.error = 'Atleast one option should be correct';
        errors++;
      }
    });

    if (errors > 0) return;

    formService.edit(formData._id, data).then(
      (result) => {
        console.log(result);
        setQuestions(result.questions);
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

  function checkImageHereOrNotForQuestion(gg) {
    if (gg === undefined || gg === '') {
      return false;
    } else {
      return true;
    }
  }

  function checkImageHereOrNotForOption(gg) {
    if (gg === undefined || gg === '') {
      return false;
    } else {
      return true;
    }
  }

  function addMoreQuestionField() {
    expandCloseAll();

    setQuestions((questions) => [
      ...questions,
      {
        questionText: 'Question',
        marks: 1,
        options: [{ optionText: 'Option 1', isCorrect: true }],
        open: true,
      },
    ]);
  }

  function copyQuestion(i) {
    let qs = [...questions];
    expandCloseAll();
    const myNewOptions = [];
    var opn1new;
    qs[i].options.forEach((opn) => {
      if (opn.optionImage !== undefined || opn.optionImage !== '') {
        opn1new = {
          optionText: opn.optionText,
          optionImage: opn.optionImage,
          isCorrect: opn.isCorrect,
        };
      } else {
        opn1new = {
          optionText: opn.optionText,
          isCorrect: opn.isCorrect,
        };
      }
      myNewOptions.push(opn1new);
    });
    const qImage = qs[i].questionImage || '';
    var newQuestion = {
      questionText: qs[i].questionText,
      questionImage: qImage,
      options: myNewOptions,
      open: true,
      marks: qs[i].marks,
    };
    setQuestions((questions) => [...questions, newQuestion]);
  }

  const handleImagePopupOpen = () => {
    setOpenUploadImagePop(true);
  };

  function uploadImage(i, j) {
    setImageContextData({
      question: i,
      option: j,
    });
    handleImagePopupOpen();
  }

  function updateImageLink(link, context) {
    var optionsOfQuestion = [...questions];
    var i = context.question;

    if (context.option == null) {
      optionsOfQuestion[i].questionImage = link;
    } else {
      var j = context.option;
      optionsOfQuestion[i].options[j].optionImage = link;
    }
    setQuestions(optionsOfQuestion);
  }

  function deleteQuestion(i) {
    let qs = [...questions];
    if (questions.length > 1) {
      qs.splice(i, 1);
    }
    setQuestions(qs);
  }

  function handleOptionValue(text, i, j) {
    var optionsOfQuestion = [...questions];
    optionsOfQuestion[i].options[j].optionText = text;
    setQuestions(optionsOfQuestion);
  }

  function handleQuestionMarks(mark, i) {
    var optionsOfQuestion = [...questions];
    console.log(mark, i);
    optionsOfQuestion[i].marks = mark;
    setQuestions(optionsOfQuestion);
  }

  function handleOptionCorrectness(i, j) {
    var optionsOfQuestion = [...questions];
    optionsOfQuestion[i].error = '';
    optionsOfQuestion[i].options[j].isCorrect = !optionsOfQuestion[i].options[j].isCorrect;
    setQuestions(optionsOfQuestion);
  }

  function handleQuestionValue(text, i) {
    var optionsOfQuestion = [...questions];
    optionsOfQuestion[i].questionText = text;
    setQuestions(optionsOfQuestion);
  }

  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }
    var itemgg = [...questions];

    const itemF = reorder(itemgg, result.source.index, result.destination.index);

    setQuestions(itemF);
  }

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  function showAsQuestion(i) {
    let qs = [...questions];
    qs[i].open = false;
    setQuestions(qs);
  }

  function addOption(i) {
    var optionsOfQuestion = [...questions];
    if (optionsOfQuestion[i].options.length < 5) {
      optionsOfQuestion[i].options.push({
        optionText: 'Option ' + (optionsOfQuestion[i].options.length + 1),
        isCorrect: false,
      });
    } else {
      console.log('Max  5 options ');
    }
    //console.log(optionsOfQuestion);
    setQuestions(optionsOfQuestion);
  }

  function removeOption(i, j) {
    var optionsOfQuestion = [...questions];
    if (optionsOfQuestion[i].options.length > 1) {
      optionsOfQuestion[i].options.splice(j, 1);
      setQuestions(optionsOfQuestion);
      console.log(i + '__' + j);
    }
  }

  function expandCloseAll() {
    let qs = [...questions];
    for (let j = 0; j < qs.length; j++) {
      qs[j].open = false;
    }
    setQuestions(qs);
  }

  function handleExpand(i) {
    let qs = [...questions];
    for (let j = 0; j < qs.length; j++) {
      if (i === j) {
        qs[i].open = true;
      } else {
        qs[j].open = false;
      }
    }
    setQuestions(qs);
  }

  function questionsUI() {
    return questions.map((ques, i) => (
      <Draggable key={i} draggableId={i + 'id'} index={i}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
            <div>
              <div style={{ marginBottom: '15px' }}>
                <div style={{ width: '100%', marginBottom: '-7px' }}>
                  <DragIndicatorIcon
                    style={{ transform: 'rotate(-90deg)', color: '#DAE0E2' }}
                    fontSize="small"
                  />
                </div>

                <Accordion
                  onChange={() => {
                    handleExpand(i);
                  }}
                  expanded={questions[i].open}
                  sx={{ width: '100%' }}
                >
                  <AccordionSummary
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    elevation={1}
                    sx={{ width: '100%' }}
                  >
                    {!questions[i].open ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          marginLeft: '3px',
                          paddingTop: '5px',
                          width: '100%',
                          paddingBottom: '5px',
                        }}
                      >
                        {/* <TextField id="standard-basic" label=" " value="Question" InputProps={{ disableUnderline: true }} />  */}

                        <Typography variant="subtitle1" style={{ marginLeft: '0px' }}>
                          {i + 1}. {ques.questionText}
                        </Typography>

                        {ques.questionImage !== '' ? (
                          <div>
                            <img src={ques.questionImage} width="400px" height="auto" />
                            <br></br>
                            <br></br>
                          </div>
                        ) : (
                          ''
                        )}
                        <div style={{ color: 'red', fontSize: '12px' }}>{ques.error}</div>
                        <div
                          style={{
                            width: '100%',
                            textAlign: 'right',
                            color: '#555555',
                            fontSize: '12px',
                          }}
                        >
                          {ques.marks} marks
                        </div>
                        {ques.options.map((op, j) => (
                          <div key={j}>
                            <div style={{ display: 'flex' }}>
                              <FormControlLabel
                                disabled
                                control={
                                  <Radio checked={ques.options[j].isCorrect} color="success" />
                                }
                                label={
                                  <Typography style={{ color: '#555555' }}>
                                    {ques.options[j].optionText}
                                  </Typography>
                                }
                              />
                            </div>

                            <div>
                              {op.optionImage !== '' ? (
                                <img src={op.optionImage} width="160px" height="auto" />
                              ) : (
                                ''
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      ''
                    )}
                  </AccordionSummary>

                  <AccordionDetails>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        marginLeft: '15px',
                        marginTop: '-15px',
                      }}
                    >
                      <div
                        style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}
                      >
                        <Typography style={{ marginTop: '20px' }}>{i + 1}.</Typography>
                        <TextField
                          fullWidth={true}
                          placeholder="Question Text"
                          style={{ marginBottom: '5px' }}
                          rows={2}
                          rowsmax={20}
                          multiline={true}
                          value={ques.questionText}
                          onChange={(e) => {
                            handleQuestionValue(e.target.value, i);
                          }}
                        />
                        <IconButton
                          aria-label="upload image"
                          onClick={() => {
                            uploadImage(i, null);
                          }}
                        >
                          <CropOriginalIcon />
                        </IconButton>
                      </div>

                      <div>
                        {checkImageHereOrNotForQuestion(ques.questionImage) ? (
                          <div>
                            <div
                              style={{
                                width: '150px',
                                display: 'flex',
                                alignItems: 'flex-start',
                                paddingLeft: '20px',
                              }}
                            >
                              <img src={ques.questionImage} width="150px" height="auto" />
                              <IconButton
                                style={{
                                  marginLeft: '-15px',
                                  marginTop: '-15px',
                                  zIndex: 999,
                                  backgroundColor: 'lightgrey',
                                  color: 'grey',
                                }}
                                size="small"
                                onClick={() => {
                                  updateImageLink('', { question: i, option: null });
                                }}
                              >
                                <CloseIcon />
                              </IconButton>
                            </div>
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                          width: '100%',
                          marginRight: '20%',
                        }}
                      >
                        <TextField
                          select
                          label="Marks"
                          value={ques.marks}
                          onChange={(e) => {
                            handleQuestionMarks(e.target.value, i);
                          }}
                          sx={{ marginRight: '2%' }}
                        >
                          {marks.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      </div>
                      <div style={{ width: '100%' }}>
                        {ques.options.map((op, j) => (
                          <div key={j}>
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                marginLeft: '-12.5px',
                                justifyContent: 'space-between',
                                paddingTop: '5px',
                                paddingBottom: '5px',
                              }}
                            >
                              <Radio
                                checked={ques.options[j].isCorrect}
                                color="success"
                                onClick={() => {
                                  handleOptionCorrectness(i, j);
                                }}
                              />
                              <TextField
                                fullWidth={true}
                                placeholder="Option text"
                                style={{ marginTop: '5px' }}
                                value={ques.options[j].optionText}
                                onChange={(e) => {
                                  handleOptionValue(e.target.value, i, j);
                                }}
                              />

                              <IconButton
                                aria-label="upload image"
                                onClick={() => {
                                  uploadImage(i, j);
                                }}
                              >
                                <CropOriginalIcon />
                              </IconButton>

                              <IconButton
                                aria-label="delete"
                                onClick={() => {
                                  removeOption(i, j);
                                }}
                              >
                                <CloseIcon />
                              </IconButton>
                            </div>

                            <div>
                              {checkImageHereOrNotForOption(op.optionImage) ? (
                                <div>
                                  <div
                                    style={{
                                      width: '150px',
                                      display: 'flex',
                                      alignItems: 'flex-start',
                                      paddingLeft: '20px',
                                    }}
                                  >
                                    <img src={op.optionImage} width="90px" height="auto" />

                                    <IconButton
                                      style={{
                                        marginLeft: '-15px',
                                        marginTop: '-15px',
                                        zIndex: 999,
                                        backgroundColor: 'lightgrey',
                                        color: 'grey',
                                      }}
                                      size="small"
                                      onClick={() => {
                                        updateImageLink('', { question: i, option: j });
                                      }}
                                    >
                                      <CloseIcon />
                                    </IconButton>
                                  </div>
                                  <br></br>
                                  <br></br>
                                </div>
                              ) : (
                                ''
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {ques.options.length < 5 ? (
                        <div>
                          <FormControlLabel
                            disabled
                            control={<Radio />}
                            label={
                              <Button
                                size="small"
                                onClick={() => {
                                  addOption(i);
                                }}
                                style={{ textTransform: 'none', marginLeft: '-5px' }}
                              >
                                Add Option
                              </Button>
                            }
                          />
                        </div>
                      ) : (
                        ''
                      )}
                    </div>
                  </AccordionDetails>

                  <Divider />

                  <AccordionActions>
                    <Typography variant="body2" style={{ flexGrow: 1, textAlign: 'left' }}>
                      Select the correct options
                    </Typography>
                    <IconButton
                      aria-label="View"
                      onClick={() => {
                        showAsQuestion(i);
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>

                    <IconButton
                      aria-label="Copy"
                      onClick={() => {
                        copyQuestion(i);
                      }}
                    >
                      <FilterNoneIcon />
                    </IconButton>

                    <IconButton
                      aria-label="delete"
                      onClick={() => {
                        deleteQuestion(i);
                      }}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </AccordionActions>
                </Accordion>
              </div>
            </div>
          </div>
        )}
      </Draggable>
    ));
  }

  return (
    <div style={{ marginTop: '15px', marginBottom: '7px', paddingBottom: '30px' }}>
      <Grid container direction="column" justify="center" alignItems="center">
        {loadingFormData ? <CircularProgress /> : ''}

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
                  >
                    <Typography
                      variant="h4"
                      style={{ fontFamily: 'sans-serif Roboto', marginBottom: '15px' }}
                    >
                      {formData.name}
                    </Typography>
                    <Typography variant="subtitle1">{formData.description}</Typography>
                  </div>
                </Paper>
              </div>
            </div>
          </Grid> */}

          <Grid style={{ paddingTop: '10px' }}>
            <div>
              <ImageUplaodModel
                handleImagePopOpen={openUploadImagePop}
                handleImagePopClose={() => {
                  setOpenUploadImagePop(false);
                }}
                updateImageLink={updateImageLink}
                contextData={imageContextData}
              />

              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {questionsUI()}

                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              <div>
                <Button
                  variant="contained"
                  onClick={addMoreQuestionField}
                  endIcon={<AddCircleIcon />}
                  style={{ margin: '5px' }}
                >
                  Add Question{' '}
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={saveQuestions}
                  style={{ margin: '15px' }}
                  endIcon={<SaveIcon />}
                >
                  Save Questions{' '}
                </Button>
              </div>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
export default QuestionsTab;
