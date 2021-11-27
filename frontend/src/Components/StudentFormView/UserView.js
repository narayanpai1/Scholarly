import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import formService from '../../services/formService';
import NavigBar from '../NavigBar';
import Responding from './Responding';
import Responded from './Responded';
import Forbidden from '../Errors/Forbidden';

/***
 * The view of the test to the student.
 * 
 * If the user has attempted, the component will load the review-attempt page.
 * Else it will let the user attempt the page if the test is active.
 * If the test is not active and the user has not attempted, 
 * it will show the forbidden page since there is no way the user would have gotten the link
 */
function UserView(props) {
  let formId = props.match.params.formId;
  const [loading, setLoading] = React.useState(true);
  const [response, setResponse] = React.useState(null);
  const [formData, setFormData] = React.useState({});

  React.useEffect(() => {
    if (!formId) return;

    formService.getMyResponse(formId).then((res) => {
      setResponse(res);
    });

    formService.get(formId).then((res) => {
      setFormData(res);
    });
  }, [formId]);

  React.useEffect(() => {
    if (Object.keys(formData).length !== 0 && response !== null) {
      setLoading(false);
    }
  }, [formData, response]);

  function isFormActive(){
    if(Object.keys(formData).length === 0)  return false;
    let currDateTime = new Date(),
      startTime = new Date(formData.startTime),
      endTime = new Date(formData.endTime);

    return (currDateTime > startTime && currDateTime < endTime);
  }

  return (
    <>
      <NavigBar />
      <div style={{ minHeight: '100vh' }}>
        <div>
          <br />

          <Grid container direction="column" justify="center" alignItems="center">
            <Grid item xs={12} style={{ width: '100%' }}>
              <Typography
                variant="h4"
                style={{ fontFamily: 'sans-serif Roboto', marginBottom: '15px' }}
              >
                {formData.name}
              </Typography>
              <Typography variant="subtitle1">{formData.description}</Typography>
              {loading ? <CircularProgress /> : ''}
              {!loading &&
                Object.keys(response).length === 0 &&
                isFormActive() &&
                <Responding formData={formData} />}
              {!loading &&
                Object.keys(response).length === 0 && 
                !isFormActive() &&
                  <Forbidden/>
              }
              {!loading &&
                Object.keys(response).length !== 0 && 
                <Responded formData={formData} responseData={response} />
              }
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  );
}

export default UserView;
