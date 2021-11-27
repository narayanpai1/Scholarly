import React from 'react';

import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import CircularProgress from '@mui/material/CircularProgress';
import meetingService from '../../services/meetingService';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import styled from 'styled-components';
import Card from '@mui/material/Card';

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

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

/***
 * The meetings tab of the course
 */
function Meetings(props) {
  let { course } = props;
  const classes = useStyles();
  const [meetings, setMeetings] = React.useState(null);
  const [loadingForms, setLoadingForms] = React.useState(true);

  // Get all the meetings once we get the course prop
  React.useEffect(() => {
    if (!course) return;

    meetingService.getAllMeetingsOfCourse(course._id).then(
      (meetings) => {
        console.log(meetings);
        setMeetings(meetings);
        setLoadingForms(false);
      }
      ,
      (error) => {
        const resMessage =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(resMessage);
      },
    );
  }, [course]);

  return (
    <div>
      <div>
        <CssBaseline />
        {loadingForms ? <CircularProgress /> : ''}
        <Container className={classes.cardGrid} maxWidth="lg">
          <Grid container spacing={6}>
            {meetings &&
              meetings.map((meeting, i) => (
                <Grid item xs={12} sm={6} md={3} key={i}>
                  <Card className={classes.root}>
                    <CardActionArea>
                      <CardMedia
                        className={classes.media}
                        image={'/course-' + getRandomInt(5) + '.jpg'}
                        title="Contemplative Reptile"
                      />
                      <CardContent sx={{ backgroundColor: '#e6e6e6' }}>
                        <div
                          style={{
                            lineHeight: '1.5em',
                            minHeight: '1.5em',
                            textAlign: 'right',
                          }}
                        >
                          {meeting.active && <Badge>❆ Active </Badge>}
                          {!meeting.active && <Badge>Concluded</Badge>}
                        </div>
                        <Typography
                          sx={{ textAlign: 'left' }}
                          gutterBottom
                          variant="h5"
                          component="h2"
                        >
                          {meeting.name}
                        </Typography>
                        <div
                          style={{
                            lineHeight: '1.5em',
                            minHeight: '1.5em',
                            textAlign: 'left',
                          }}
                        >
                          {/* Show the recording or attend button if its active or recorded */}
                          {meeting.record && (
                            <Button size="small" sx={{ margin: 0, padding: 0 }} href={meeting.link}>
                              Watch the recording
                            </Button>
                          )}
                          {meeting.active && (
                            <Button size="small" sx={{ margin: 0, padding: 0 }} href={meeting.link}>
                              Attend Now!
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Container>
      </div>
    </div>
  );
}

export default Meetings;

const Badge = styled.span`
    border-radius: 10px;
    font-size: 8.5px;
    color: white;
    background-color: green;
    padding: 2px 4px;
    text-transform: uppercase;
`;
