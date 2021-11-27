import * as React from 'react';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDateTimePicker from '@mui/lab/MobileDateTimePicker';
import DateAdapter from '@mui/lab/AdapterMoment';
import { useHistory} from 'react-router-dom';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Snackbar from '@mui/material/Snackbar';

import formService from '../../services/formService';
import courseService from '../../services/courseService';
import NavigBar from '../NavigBar';
import auth from '../../services/authService';
import Forms from '../Form/Forms';
import CustomTabs from '../util/CustomTabs';
import TabPanel from '../util/TabPanel';
import meetingService from '../../services/meetingService';
import Meetings from './Meetings';


const useStyles = makeStyles(() => ({
  courseContentRoot: {
    padding: '3vw',
  },
  coverSection: {
    backgroundColor: '#d9d9d9',
    padding: '5px 2vw 0px 2vw',
  },
  coverSectionRight: {
    textAlign: 'left',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  courseHeading: {
    fontSize: 30,
    margin: '5px',
  },
  courseDescription: {
    margin: '5px',
  },
  newFormButton: { float: 'right' },
}));

/***
 * The course tab of the dashboard.
 * 
 * Shows different courses present.
 */
function CourseView(props) {
  let classes = useStyles();
  let history = useHistory();
  let user = auth.getCurrentUser();

  const [open, setOpen] = React.useState(false);
  const courseId = props.match.params.courseId;
  const [course, setCourse] = React.useState({});
  const [formTitle, setFormTitle] = React.useState('');
  const [formDescription, setFormDescription] = React.useState('');
  const [formStartTime, setFormStartTime] = React.useState(new Date());
  const [formEndTime, setFormEndTime] = React.useState(new Date());
  const [formNameHelper, setFormNameHelper] = React.useState(null);
  const [tabValue, setTabValue] = React.useState(0);
  const [classTitle, setClassTitle] = React.useState('');
  const [classRecord, setClassRecord] = React.useState(true);
  const [classNameHelper, setClassNameHelper] = React.useState(null);

  // to indicate 'Redirecting to meeting' message
  const [toastMessage, setToastMessage] = React.useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  React.useEffect(() => {
    if (!courseId) {
      return;
    }

    courseService.get(courseId).then(
      (course) => {
        setCourse(course);
      },

      (error) => {
        const resMessage =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(resMessage);
      },
    );
  }, [courseId]);

  /***
   * Opens the form for meeting/test creation
   */
  const handleClickOpen = () => {
    setOpen(true);
  };

  /***
   * Closes the form for meeting/test creation
   */
  const handleClose = () => {
    setOpen(false);
  };

  /***
   * Closes and resets the form for test creation
   */
  const cancelAddForm = () => {
    handleClose();
    setFormTitle('');
    setFormDescription('');
    setFormNameHelper(null);
  };

  /***
   * Closes and resets the form for test creation
   */
  const cancelAddMeeting = () => {
    handleClose();
    setClassTitle('');
    setClassRecord(true);
    setClassNameHelper(null);
  };

  const handleFormStartTimeChange = (newValue) => {
    setFormStartTime(newValue);
  };

  const handleFormEndTimeChange = (newValue) => {
    setFormEndTime(newValue);
  };

  /***
   * Creates a new meeting with the help of meeting service
   * Also validates the form
   */
  const createMeeting = () => {
    var data = {
      name: classTitle,
      course: course._id,
      record: classRecord,
    };
    setClassNameHelper(null);

    if (data.name === '') {
      setClassNameHelper('Class Name is mandatory');
      return;
    }

    meetingService.add(data).then(
      (result) => {
        handleClose();
        setToastMessage('Redirecting to the meeting');
        window.location.replace(result.link);
      },

      (error) => {
        const resMessage =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(resMessage);
      },
    );
  };

  /***
   * Creates a new form with the help of form service
   * Also validates the form and sets error-helpers if required
   */
  const createCourse = () => {
    var data = {
      name: formTitle,
      description: formDescription,
      course: props.match.params.courseId,
      startTime: formStartTime.toJSON(),
      endTime: formEndTime.toJSON(),
    };
    setFormNameHelper(null);

    if (data.name === '') {
      setFormNameHelper('Test Name is mandatory');
      return;
    }
    formService.add(data).then(
      (result) => {
        console.log(result);
        history.push('/form/' + result._id);
      },

      (error) => {
        const resMessage =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(resMessage);
      },
    );
  };

  return (
    <>
      <NavigBar />
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={Boolean(toastMessage)}
        message={toastMessage}
        sx={{
          '.MuiSnackbarContent-root': {
            fontSize: '18px',
          },
        }}
      />
      <div className={classes.courseRoot}>
        <Grid container spacing={2} className={classes.coverSection}>
          <Grid item xs={12} sm={3}>
            <img style={{ width: '100%' }} src={course.url} />
          </Grid>
          <Grid
            item
            xs={12}
            sm={9}
            className={classes.coverSectionRight}
            sx={{ flexDirection: 'column' }}
          >
            <div className={classes.courseHeading}>{course.name}</div>
            <div className={classes.courseDescription}>{course.description}</div>
            <CustomTabs
              value={tabValue}
              handleChange={handleTabChange}
              tabs={['Tests', 'Classes']}
            />
          </Grid>
        </Grid>
        <div className={classes.courseContentRoot}>
          {user && user._id && course.createdBy === user._id && (
            <Button
              variant="contained"
              className={classes.newFormButton}
              sx={{ margin: '10px' }}
              onClick={handleClickOpen}
            >
              {tabValue === 0 ? <>Create a New test</> : <>Create a New Class</>}
            </Button>
          )}
          <TabPanel index={0} value={tabValue}>
            <Forms course={course} />
          </TabPanel>
          <TabPanel index={1} value={tabValue}>
            <Meetings course={course} />
          </TabPanel>
          <Dialog fullWidth open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Create a new Test</DialogTitle>
            <TabPanel index={0} value={tabValue}>
              <DialogContent fullWidth>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  required
                  label="Test Name"
                  type="text"
                  fullWidth
                  value={formTitle}
                  onChange={(e) => {
                    setFormTitle(e.target.value);
                  }}
                  error={Boolean(formNameHelper)}
                  helperText={formNameHelper}
                />
                <br></br>
                <TextField
                  margin="dense"
                  id="description"
                  label="Test description"
                  type="text"
                  fullWidth
                  value={formDescription}
                  onChange={(e) => {
                    setFormDescription(e.target.value);
                  }}
                />
                <br></br>
                <LocalizationProvider dateAdapter={DateAdapter}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <MobileDateTimePicker
                        label="Start Time(IST)"
                        value={formStartTime}
                        onChange={handleFormStartTimeChange}
                        renderInput={(params) => <TextField {...params} margin="dense" fullWidth />}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MobileDateTimePicker
                        label="End Time(IST)"
                        value={formEndTime}
                        onChange={handleFormEndTimeChange}
                        renderInput={(params) => <TextField {...params} margin="dense" fullWidth />}
                      />
                    </Grid>
                  </Grid>
                </LocalizationProvider>
                <br></br>
              </DialogContent>
              <DialogActions>
                <Button onClick={cancelAddForm} color="primary">
                  Cancel
                </Button>
                <Button onClick={createCourse} color="primary">
                  Create
                </Button>
              </DialogActions>
            </TabPanel>

            <TabPanel index={1} value={tabValue}>
              <DialogContent fullWidth>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  required
                  label="Class Topic"
                  type="text"
                  fullWidth
                  value={classTitle}
                  onChange={(e) => {
                    setClassTitle(e.target.value);
                  }}
                  error={Boolean(classNameHelper)}
                  helperText={classNameHelper}
                />
                <br></br>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={classRecord}
                      onChange={() => {
                        setClassRecord(!classRecord);
                      }}
                    />
                  }
                  label={'Record the class'}
                />
                <br></br>
              </DialogContent>
              <DialogActions>
                <Button onClick={cancelAddMeeting} color="primary">
                  Cancel
                </Button>
                <Button onClick={createMeeting} color="primary">
                  Create
                </Button>
              </DialogActions>
            </TabPanel>
          </Dialog>
        </div>
      </div>
    </>
  );
}

export default CourseView;
