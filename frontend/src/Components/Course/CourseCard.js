import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import auth from '../../services/authService';

function CourseList(props) {
  let { showIfEnrolled } = props;
  const [enrolled, setEnrolled] = React.useState(false);
  const [user, setUser] = React.useState(null);

  React.useEffect(async () => {
    let res = await auth.get();
    setUser(res);
  }, []);

  React.useEffect(() => {
    if (!user) {
      return;
    }

    console.log('Enrolled courses', user);

    if (user.enrolledCourses.includes(props.course._id)) {
      setEnrolled(true);
    } else {
      setEnrolled(false);
    }
  }, [user]);

  const enrollCourse = async () => {
    try {
      let user_copy = user;
      user_copy.enrolledCourses.push(props.course._id);
      setUser(user_copy);
      let res = await auth.edit(user_copy);
      console.log('got the response', res);
    } catch (err) {
      console.log(err);
    }
    setEnrolled(true);
  };

  return !showIfEnrolled || enrolled ? (
    <Grid item xs={12} sm={6} md={3}>
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia component="img" alt="green iguana" height="140" image={props.course.url} />
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
            {props.course.name}
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
            {props.course.description}
          </Typography>
        </CardContent>
        <CardActions>
          {enrolled ? (
            <>
              <Button color="primary" size="small" disabled>
                Enrolled
              </Button>
              <Button size="small" href={'/course/' + props.course._id}>
                View Course
              </Button>
            </>
          ) : (
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

export default CourseList;
