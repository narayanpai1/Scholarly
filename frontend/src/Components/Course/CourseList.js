import React from 'react';
import auth from '../../services/authService';
import courseService from '../../services/courseService';

import { makeStyles } from '@mui/styles';

import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import CourseCard from './CourseCard';
import CircularProgress from '@mui/material/CircularProgress';

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
  cardGrid: {
    paddingTop: 8,
    paddingBottom: 8,
  },
}));

function CourseList(props) {
  const classes = useStyles();
  let { enrolled } = props;
  const [user, setUser] = React.useState({});
  const [courses, setCourses] = React.useState([]);
  const [loadingCourses, setLoadingCourses] = React.useState(true);

  React.useEffect(() => {
    setUser(auth.getCurrentUser);
  }, []);

  React.useEffect(() => {
    if (user === undefined) {
      //console.log("this shit is undefined");
    } else {
      console.log('getting courses');
      courseService.getAll().then(
        (courses) => {
          setCourses(courses);
          setLoadingCourses(false);
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
  }, [user]);

  return (
    <div>
      <div>
        <CssBaseline />
        {loadingCourses ? <CircularProgress /> : ''}
        <Container className={classes.cardGrid} maxWidth="lg">
          <Grid container spacing={6}>
            {courses.map((course, i) => (
              <CourseCard showIfEnrolled={enrolled} course={course} key={i} />
            ))}
          </Grid>
        </Container>
      </div>
      <div></div>
    </div>
  );
}

export default CourseList;
