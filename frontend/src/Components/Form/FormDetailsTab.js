import React from 'react';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDateTimePicker from '@mui/lab/MobileDateTimePicker';
import DateAdapter from '@mui/lab/AdapterMoment';
import Snackbar from '@mui/material/Snackbar';


import formService from '../../services/formService';

export default function FormDetailsTab(props){
  let {formData, setFormData} = props;

  const [formTitle, setFormTitle] = React.useState('');
  const [formDescription, setFormDescription] = React.useState('');
  const [formStartTime, setFormStartTime] = React.useState(new Date());
  const [formEndTime, setFormEndTime] = React.useState(new Date());
  const [formNameHelper, setFormNameHelper] = React.useState(null);
  const [toastMessage, setToastMessage] = React.useState(null);

  React.useEffect(()=>{
    if(!formData)    return;

    console.log(formData);
    setFormTitle(formData.name);
    setFormDescription(formData.description);

    let startTime = new Date(formData.startTime),
      endTime = new Date(formData.endTime);
    
    setFormStartTime(startTime);
    setFormEndTime(endTime);
  }, [formData]);

  const updateForm = () => {
    if(!formData)   return;
    var data = {
      _id: formData._id,
      name: formTitle,
      description: formDescription,
      course: formData.course,
      startTime: formStartTime.toJSON(),
      endTime: formEndTime.toJSON(),
      questions: formData.questions
    };

    setFormNameHelper(null);

    if (data.name === '') {
      setFormNameHelper('Test Name is mandatory');
      return;
    }


    setToastMessage('Updating the test');

    formService.edit(formData._id, data).then(
      (result) => {
        console.log(result);
        setFormData(result);
        setToastMessage('Successfully updated');
        setTimeout(()=>{
          setToastMessage(null);
        }, 3000);
      },

      (error) => {
        setToastMessage('Some error occurred while updating');
        setTimeout(() => {
          setToastMessage(null);
        }, 3000);
        const resMessage =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(resMessage);
      },
    );
  };

  const handleFormStartTimeChange = (newValue) => {
    setFormStartTime(newValue);
  };

  const handleFormEndTimeChange = (newValue) => {
    setFormEndTime(newValue);
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={Boolean(toastMessage)}
        message={toastMessage}
        sx={{
          '.MuiSnackbarContent-root': {
            fontSize: '18px',
          },
        }}
      />
      <DialogContent>
        <TextField
          margin="dense"
          id="name"
          required
          label="Test Name"
          type="text"
          fullWidth
          value={formTitle}
          onChange={(e) => {
            setFormTitle(e.target.value);
          }}
          error={Boolean(formNameHelper)}
          helperText={formNameHelper}
        />
        <br></br>
        <TextField
          margin="dense"
          id="description"
          label="Test description"
          type="text"
          fullWidth
          value={formDescription}
          onChange={(e) => {
            setFormDescription(e.target.value);
          }}
        />
        <br></br>
        <LocalizationProvider dateAdapter={DateAdapter}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <MobileDateTimePicker
                label="Start Time(IST)"
                value={formStartTime}
                onChange={handleFormStartTimeChange}
                renderInput={(params) => <TextField {...params} margin="dense" fullWidth />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <MobileDateTimePicker
                label="End Time(IST)"
                value={formEndTime}
                onChange={handleFormEndTimeChange}
                renderInput={(params) => <TextField {...params} margin="dense" fullWidth />}
              />
            </Grid>
          </Grid>
        </LocalizationProvider>
        <br></br>
      </DialogContent>
      <DialogActions>
        <Button onClick={updateForm} color="primary">
          Update
        </Button>
      </DialogActions>
    </>
  );
}