import React from 'react';

import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';
import Moment from 'react-moment';
import Button from '@mui/material/Button';

import formService from '../../services/formService';

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

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


/***
 * A card showing a single form/test in the tests tab of course page
 * 
 * The card contains option to manage, attempt or review test depending on the context
 */
export default function OneForm(props) {
  let { formData, courseLinkPrefix } = props;
  const classes = useStyles();
  const [formResponse, setFormResponse] = React.useState(null);
  const [disabled, setDisabled] = React.useState(null);

  React.useEffect(() => {
    if (!courseLinkPrefix || !formData) return;

    if (courseLinkPrefix === '/s') {
      //if I am not the course instructor
      formService.getMyResponse(formData._id).then((res) => {
        setFormResponse(res);
      });
    } else {
      // if I am the course instructor, then I dont have to wait to see if I have
      // responded to the test or not
      setDisabled(false);
    }
  }, [courseLinkPrefix, formData]);

  // If student, set the visibility of the action buttons based on the form-response
  React.useEffect(() => {
    console.log(formResponse);
    if (formResponse === null || courseLinkPrefix === '/form') return;

    if (Object.keys(formResponse).length !== 0) {
      // If already responded, show the review button
      setDisabled(false);
    } else {
    
      // check if the test is still active and hence decide the visibility
      let currDateTime = new Date(),
        startTime = new Date(formData.startTime),
        endTime = new Date(formData.endTime);
      console.log(currDateTime, formData.startTime);
      if (currDateTime > startTime && currDateTime < endTime) {
        console.log('hey');
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    }
  }, [formResponse]);

  let getDateString = (date) => {
    date = new Date(date);
    return date.getHours() + ':' + date.getMinutes() + ', ' + date.toDateString();
  };

  return (
    <Grid item xs={12} sm={6} md={3}>
      <Card className={classes.root}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={'/course-' + getRandomInt(5) + '.jpg'}
            title="Contemplative Reptile"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {formData.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: '2',
                lineHeight: '1.5em',
                minHeight: '3em',
              }}
              component="p"
            >
              {formData.description}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              sx={{ textAlign: 'left', marginTop: '5px' }}
            >
              {courseLinkPrefix === '/form' && (
                <>
                  Last updated: <Moment fromNow>{formData.updatedAt}</Moment>
                  <br />
                </>
              )}
              {formData.startTime && <>Starts at: {getDateString(formData.startTime)}</>}
              <br />
              {formData.endTime && <> Ends at: {getDateString(formData.endTime)}</>}
              <br />

              {disabled === false && (
                <Button
                  size="small"
                  href={courseLinkPrefix ? courseLinkPrefix + '/' + formData._id : ''}
                  sx={{ padding: 0, marginTop:1 }}
                >
                  {courseLinkPrefix === '/form' && <>Manage Test</>}
                  {courseLinkPrefix === '/s' &&
                    formResponse &&
                    Object.keys(formResponse).length !== 0 && <>Review</>}
                  {courseLinkPrefix === '/s' &&
                    formResponse &&
                    Object.keys(formResponse).length === 0 && <> Attempt Now</>}
                </Button>
              )}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}
