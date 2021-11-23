import React from 'react';
import formService from '../../services/courseService';

import { makeStyles } from '@mui/styles';

import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import OneForm from './OneForm';
import CircularProgress from '@mui/material/CircularProgress';
import auth from '../../services/authService';

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

function Forms(props) {
  let { course } = props;
  const classes = useStyles();
  const [forms, setForms] = React.useState([]);
  const [loadingForms, setLoadingForms] = React.useState(true);
  const [courseLinkPrefix, setCourseLinkPrefix] = React.useState(null);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    if (!course) return;

    formService.getAllFormsOfCourse(course._id).then(
      (forms) => {
        console.log(forms);
        setForms(forms);
        setLoadingForms(false);
      },

      (error) => {
        const resMessage =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(resMessage);
      },
    );
  }, [course]);

  React.useEffect(() => {
    setUser(auth.getCurrentUser());
  }, []);

  React.useEffect(() => {
    if (!user || !course) return;

    if (course.createdBy === user._id) setCourseLinkPrefix('/form');
    else setCourseLinkPrefix('/s');
  }, [user, course]);

  console.log('forms ', forms);
  return (
    <div>
      <div>
        <CssBaseline />
        {loadingForms ? <CircularProgress /> : ''}
        <Container className={classes.cardGrid} maxWidth="lg">
          <Grid container spacing={6}>
            {forms.map((form, i) => (
              <OneForm courseLinkPrefix={courseLinkPrefix} formData={form} key={i} />
            ))}
          </Grid>
        </Container>
      </div>
      <div></div>
    </div>
  );
}

export default Forms;
