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
      setDisabled(false);
    }
  }, [courseLinkPrefix, formData]);

  React.useEffect(() => {
    console.log(formResponse);
    if (formResponse === null || courseLinkPrefix === '/form') return;
    if (Object.keys(formResponse).length !== 0) {
      setDisabled(false);
    } else {
      let currDateTime = new Date();

      if (currDateTime > formData.startTime && currDateTime < formData.endTime) {
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
            image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjW8BEA87TL1WHCVU9YGfRcFai8gU3OGQ2OlS_yD0wTqQAQ94rGwXuBxILE3KX1ERsNlo&usqp=CAU"
            title="Contemplative Reptile"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {formData.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {formData.description}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {courseLinkPrefix === '/form' && (
                <>
                  Last updated: <Moment fromNow>{formData.updatedAt}</Moment>
                  <br />
                </>
              )}
              {formData.startTime && <>Starts at: {getDateString(formData.startTime)}</>}
              {formData.endTime && <> Ends at: {getDateString(formData.endTime)}</>}

              {disabled === false && (
                <Button
                  size="small"
                  href={courseLinkPrefix ? courseLinkPrefix + '/' + formData._id : ''}
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
