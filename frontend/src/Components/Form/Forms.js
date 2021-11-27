import React from 'react';

import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import CircularProgress from '@mui/material/CircularProgress';

import formService from '../../services/courseService';
import OneForm from './OneForm';
import auth from '../../services/authService';

const useStyles = makeStyles(() => ({
  cardGrid: {
    paddingTop: 8,
    paddingBottom: 8,
  },
}));

/***
 * The Tests tab content in the course page.
 * 
 * Lists different tests/forms present in the course with multiple `OneForm` components
 */
function Forms(props) {
  let { course } = props;
  const classes = useStyles();
  const [forms, setForms] = React.useState([]);
  const [loadingForms, setLoadingForms] = React.useState(true);

  // decides if the link to show will be for the edit-test or view-test
  // if the prefix=='/s', then the link will be to view-test
  // if the prefix=='/form', them the link will be to edit-test
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
              // the link prefix will tell if OneForm component has
              // to show the edit-link or the view-link
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
