import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import auth from '../../services/authService';

function CourseCard(props) {
  let { type, course, user, setUser } = props;
  const [showCourse, setShowCourse] = React.useState(false);

  React.useEffect(() => {
    if (!user) {
      return;
    }

    console.log('Enrolled courses', user);

    if (type === 1 && user.isStudent === true && user.enrolledCourses.includes(course._id)) {
      setShowCourse(true);
    } else if (type === 0) {
      setShowCourse(true);
    } else if (type === 1 && user.isStudent === false && course.createdBy === user._id) {
      setShowCourse(true);
    } else {
      setShowCourse(false);
    }
  }, [user, course, type]);

  const enrollCourse = () => {
    try {
      let user_copy = Object.assign({}, user);
      user_copy.enrolledCourses.push(course._id);
      setUser(user_copy);
      auth.edit(user_copy).then((res) => {
        console.log('got the response', res);
      });
    } catch (err) {
      console.log(err);
    }
  };

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
        <CardActions sx={{textAlign:'left'}}>
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
