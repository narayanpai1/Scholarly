/* eslint-disable quotes */
import React from 'react';

import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import { useHistory } from 'react-router-dom';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import courseService from '../services/courseService';
import CourseList from './Course/CourseList';
import uploadService from '../services/uploadService';

import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import CustomTabs from './util/CustomTabs';
import NavigBar from '../Components/NavigBar';

const useStyles = makeStyles((theme) => ({
  newCourseButton: { float: 'right' },
}));

function Dashboard() {
  let history = useHistory();
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [imageUploading, setImageUploading] = React.useState(false);
  const [tabValue, setTabValue] = React.useState(0);
  const [courseTitle, setCourseTitle] = React.useState('');
  const [courseDescription, setCourseDescription] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const [image, setImage] = React.useState(undefined);
  const [imageWarning, setImageWarning] = React.useState('');

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
          console.log(data);
          setImageUrl(data.host + '/' + data.image);
          setImageUploading(false);
        },
        (error) => {
          const resMessage =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
          console.log(resMessage);
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
  };

  const createCourse = () => {
    var data = {
      name: courseTitle,
      description: courseDescription,
      url: imageUrl,
    };

    if (data.name !== '' && imageWarning !== '' && !imageUploading) {
      courseService.add(data).then(
        (result) => {
          console.log(result);
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
      <div
        style={{
          // eslint-disable-next-line quotes
          backgroundColor: '#1976d2',
          color: 'white',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          textAlign: 'left',
          padding: '20px',
          paddingBottom: '0px',
        }}
      >
        <h1>Dashboard</h1>
        <h3>Hey there! Narayan</h3>
      </div>
      <CustomTabs
        value={tabValue}
        handleChange={handleTabChange}
        tabs={['Explore Courses', 'Enrolled Courses', 'Manage Courses']}
      />
      <Dialog fullWidth open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create a new Course</DialogTitle>
        <DialogContent fullWidth>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Course Name"
            type="text"
            fullWidth
            value={courseTitle}
            onChange={(e) => {
              setCourseTitle(e.target.value);
            }}
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
              await setImage(e.target.files[0]);
              setImageWarning(false);
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
        <Button
          variant="contained"
          className={classes.newCourseButton}
          sx={{ margin: '10px' }}
          onClick={handleClickOpen}
        >
          Create a new Course
        </Button>
        <CourseList enrolled={tabValue === 1} />
      </div>
    </>
  );
}

export default Dashboard;
