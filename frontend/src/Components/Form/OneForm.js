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

  React.useEffect(() => {
    if (!courseLinkPrefix || !formData) return;

    if (courseLinkPrefix === '/s') {
      //if I am not the course instructor
      formService.getMyResponse(formData._id).then((res) => {
        setFormResponse(res);
      });
    }
  }, [courseLinkPrefix, formData]);

  return (
    <Grid item xs={12} sm={6} md={3}>
      <Card className={classes.root}>
        <CardActionArea href={courseLinkPrefix ? courseLinkPrefix + '/' + formData._id : ''}>
          <CardMedia
            className={classes.media}
            image="https://static.makeuseof.com/wp-content/uploads/2019/06/AutoGradingQuizResults-GoogleForms.jpg"
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
              <Button
                size="small"
                href={courseLinkPrefix ? courseLinkPrefix + '/' + formData._id : ''}
              >
                {courseLinkPrefix === '/form' && <>Manage Test</>}
                {courseLinkPrefix === '/s' && formResponse && Object.keys(formResponse) !== 0 && (
                  <>Review</>
                )}
                {courseLinkPrefix === '/s' && formResponse && Object.keys(formResponse) === 0 && (
                  <> Attempt Now</>
                )}
              </Button>
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}
