import * as React from 'react';

import Forms from '../Form/Forms';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

import formService from '../../services/formService';
import courseService from '../../services/courseService';
import NavigBar from '../NavigBar';
import auth from '../../services/authService';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
// import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import MobileDateTimePicker from '@mui/lab/MobileDateTimePicker';
import DateAdapter from '@mui/lab/AdapterMoment';

const useStyles = makeStyles((theme) => ({
  courseRoot: {
    margin: '3vw',
  },
  coverSection: {
    backgroundColor: '#d9d9d9',
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

function CourseView(props) {
  let classes = useStyles();
  let user = auth.getCurrentUser();
  const [open, setOpen] = React.useState(false);
  const courseId = props.match.params.courseId;
  const [course, setCourse] = React.useState({});

  const [formTitle, setFormTitle] = React.useState('');
  const [formDescription, setFormDescription] = React.useState('');
  const [formStartTime, setFormStartTime] = React.useState(new Date());
  const [formEndTime, setFormEndTime] = React.useState(new Date());

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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const cancelAddForm = () => {
    handleClose();
    setFormTitle('');
    setFormDescription('');
  };

  const handleFormStartTimeChange = (newValue) => {
    console.log(newValue);
    setFormStartTime(newValue);
  };

  const handleFormEndTimeChange = (newValue) => {
    setFormEndTime(newValue);
  };

  const createCourse = () => {
    var data = {
      name: formTitle,
      description: formDescription,
      course: props.match.params.courseId,
      startTime: formStartTime.toJSON(),
      endTime: formEndTime.toJSON(),
    };

    if (data.name !== '') {
      formService.add(data).then(
        (result) => {
          console.log(result);
          setOpen(false);
          window.location.reload(false);
          // history.push('/form/' + result._id);
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
  };

  return (
    <>
      <NavigBar />
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
          </Grid>
        </Grid>
        {user && user._id && course.createdBy === user._id && (
          <Button
            variant="contained"
            className={classes.newFormButton}
            sx={{ margin: '10px' }}
            onClick={handleClickOpen}
          >
            Create a new test
          </Button>
        )}
        <Forms course={course} />
        <Dialog fullWidth open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Create a new Test</DialogTitle>
          <DialogContent fullWidth>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Test Name"
              type="text"
              fullWidth
              value={formTitle}
              onChange={(e) => {
                setFormTitle(e.target.value);
              }}
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
        </Dialog>
      </div>
    </>
  );
}

export default CourseView;
