import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import auth from '../../services/authService';

/***
 * A card containing different details of the course.
 * To be shown in the dashboard
 */
function CourseCard(props) {
  let { tabNumber, course, user, setUser } = props;
  const [showCourse, setShowCourse] = React.useState(false);

  React.useEffect(() => {
    if (!user) {
      return;
    }

    // Set the visibility of the course based on the tab and tabNumber of student
    // tabNumber = 2 equals 'managed courses' for teachers
    // and it equals 'enrolled courses' for students
    if (tabNumber === 1 && user.isStudent === true && user.enrolledCourses.includes(course._id)) {
      setShowCourse(true);
    } else if (tabNumber === 0) {
      setShowCourse(true);
    } else if (tabNumber === 1 && user.isStudent === false && course.createdBy === user._id) {
      setShowCourse(true);
    } else {
      setShowCourse(false);
    }
  }, [user, course, tabNumber]);

  /***
   * Update the user through the API to add the enrolled course
   */
  const enrollCourse = () => {
    try {
      let user_copy = Object.assign({}, user);
      user_copy.enrolledCourses.push(course._id);
      setUser(user_copy);
      auth.edit(user_copy);
    } catch (err) {
      console.log(err);
    }
  };

  // if the visibility set to false, dont show anything
  return showCourse ? (
    <Grid item xs={12} sm={6} md={3}>
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia component="img" alt="green iguana" height="140" image={course.url} />
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: '1',
            }}
          >
            {course.name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: '2',
              lineHeight: '1.5em',
              minHeight: '3em',
            }}
          >
            {course.description}
          </Typography>
        </CardContent>
        <CardActions sx={{ textAlign: 'left', minHeight: '3em', lineHeight: '1.5em' }}>
          {course && user && course.createdBy === user._id && (
            <Button size="small" href={'/course/' + course._id}>
              Manage Course
            </Button>
          )}
          {course &&
            user &&
            user.isStudent === true &&
            course.createdBy !== user._id &&
            user.enrolledCourses.includes(course._id) && (
            <>
              <Button color="primary" size="small" disabled>
                  Enrolled
              </Button>
              <Button size="small" href={'/course/' + course._id}>
                  View Course
              </Button>
            </>
          )}
          {course &&
            user &&
            user.isStudent === true &&
            course.createdBy !== user._id &&
            !user.enrolledCourses.includes(course._id) && (
            <Button size="small" onClick={enrollCourse}>
                Enroll
            </Button>
          )}
        </CardActions>
      </Card>
    </Grid>
  ) : (
    <></>
  );
}

export default CourseCard;
