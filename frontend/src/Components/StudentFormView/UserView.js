import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import formService from '../../services/formService';
import NavigBar from '../NavigBar';
import Responding from './Responding';
import Responded from './Responded';

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
              {!loading && Object.keys(response).length === 0 && <Responding formData={formData} />}
              {!loading &&
                Object.keys(formData).length !== 0 &&
                Object.keys(response).length !== 0 && (
                  <Responded formData={formData} responseData={response} />
                )}
            </Grid>
          </Grid>

          {/* //TODO: Add a footer here */}
        </div>
      </div>
    </>
  );
}

export default UserView;
