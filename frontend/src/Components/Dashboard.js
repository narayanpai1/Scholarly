import React from 'react';

import { makeStyles } from '@mui/styles';
import { useHistory } from 'react-router-dom';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

import courseService from '../services/courseService';
import CourseList from './Course/CourseList';
import uploadService from '../services/uploadService';
import CustomTabs from './util/CustomTabs';
import NavigBar from '../Components/NavigBar';
import TabPanel from './util/TabPanel';
import auth from '../services/authService';

const useStyles = makeStyles(() => ({
  newCourseButton: { float: 'right' },
}));

/***
 * The user dashboard containing different tabs like
 * All Courses, Enrolled Courses, Manage Courses depending on the user-type.
 * 
 * It contains the form to create a new course too.
 */
function Dashboard() {
  let history = useHistory();
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [user, setUser] = React.useState({});
  const [imageUploading, setImageUploading] = React.useState(false);
  const [tabValue, setTabValue] = React.useState(0);
  const [courseTitle, setCourseTitle] = React.useState('');
  const [courseDescription, setCourseDescription] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const [image, setImage] = React.useState(undefined);
  const [imageWarning, setImageWarning] = React.useState('');
  const [courseNameHelper, setCourseNameHelper] = React.useState(null);

  React.useEffect(() => {
    setUser(auth.getCurrentUser());
  }, []);

  React.useEffect(() => {
    if (!image) {
      return;
    }

    if (image.size > 3110670) {
      setImageWarning('File Size is too big');
    } else {
      setImageUploading(true);

      const formData = new FormData();
      formData.append('myfile', image);
      uploadService.uploadImage(formData).then(
        (data) => {
          setImageUrl(data.host + '/' + data.image);
          setImageUploading(false);
        },
        (error) => {
          const resMessage =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();

          setImageWarning(resMessage);
          setImageUploading(false);
        },
      );
    }
  }, [image]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const cancelAddForm = () => {
    handleClose();
    setCourseTitle('');
    setCourseDescription('');
    setImageUrl('');
    setCourseNameHelper(null);
  };

  const createCourse = () => {
    setCourseNameHelper(null);
    var data = {
      name: courseTitle,
      description: courseDescription,
      url: imageUrl,
    };

    if(data.name===''){
      setCourseNameHelper('Course Name is required');
      return;
    }
    if (imageWarning === '' && !imageUploading) {
      courseService.add(data).then(
        (result) => {
          setOpen(false);
          history.push('/course/' + result._id);
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
      <Grid
        container
        sx={{
          backgroundColor: '#1976d2',
          color: 'white',
          textAlign: 'left',
          padding: '0px',
          margin: '0px',
          width:'100%'
        }}
        spacing={5}
      >
        <Grid item sm={2}>
          <img src="/dashboard.png" style={{ width: '100%' }} />
        </Grid>
        <Grid item sm={10}>
          <div 
            style={{display: 'flex',
              justifyContent: 'flex-end',
              flexDirection: 'column',
              height:'100%'
            }}>
            <h1>Dashboard</h1>

            {Object.keys(user).length !== 0 && <h3>Hey there! {user.name}</h3>}
          </div>
        </Grid>
      </Grid>
      <CustomTabs
        value={tabValue}
        handleChange={handleTabChange}
        tabs={
          user.isStudent === false
            ? ['All Courses', 'Manage Courses']
            : ['Explore Courses', 'Enrolled Courses']
        }
      />

      <Dialog fullWidth open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create a new Course</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            required
            label="Course Name"
            type="text"
            fullWidth
            value={courseTitle}
            onChange={(e) => {
              setCourseTitle(e.target.value);
            }}
            error={Boolean(courseNameHelper)}
            helperText={courseNameHelper}
          />
          <br></br>
          <TextField
            margin="dense"
            id="description"
            label="Course description"
            type="text"
            fullWidth
            value={courseDescription}
            onChange={(e) => {
              setCourseDescription(e.target.value);
            }}
          />
          <br></br>
          Thumbnail
          <br></br>
          {imageUploading && (
            <>
              <div>Uploading...</div>
              <br></br>
            </>
          )}
          {imageWarning && (
            <>
              <div>{imageWarning}</div>
              <br></br>
            </>
          )}
          <TextField
            type="file"
            fullWidth
            onChange={async (e) => {
              setImageWarning('');
              await setImage(e.target.files[0]);
            }}
          />
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
      <div style={{ marginTop: '10px' }}>
        <TabPanel index={1} value={tabValue}>
          {user.isStudent === false && (
            <Button
              variant="contained"
              className={classes.newCourseButton}
              sx={{ margin: '20px' }}
              onClick={handleClickOpen}
            >
              Create a new Course
            </Button>
          )}
        </TabPanel>
        <CourseList tabNumber={tabValue} />
      </div>
    </>
  );
}

export default Dashboard;
