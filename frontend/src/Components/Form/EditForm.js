import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@mui/styles';
import { Grid } from '@mui/material';

import { Paper, Typography } from '@mui/material';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import MoreIcon from '@mui/icons-material/MoreVert';
import SettingsIcon from '@mui/icons-material/Settings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PaletteIcon from '@mui/icons-material/Palette';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FilterNoneIcon from '@mui/icons-material/FilterNone';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import StarBorderIcon from '@mui/icons-material/StarBorder';

import ViewListIcon from '@mui/icons-material/ViewList';

import QuestionsTab from './QuestionsTab';
import ResponseTab from '../Response/ResponseTab';
import formService from '../../services/formService';
import auth from '../../services/authService';
import TabPanel from '../util/TabPanel';
import CustomTabs from '../util/CustomTabs';
import NavigBar from '../NavigBar';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: 2,
  },
  toolbar: {
    minHeight: 128,
    alignItems: 'flex-start',
    paddingTop: 1,
    //paddingBottom: 2),
  },
  title: {
    flexGrow: 1,
    alignSelf: 'flex-end',
    justifySelf: 'center',
  },
  paper: {
    padding: 2,
    color: theme.palette.text.secondary,
    display: 'flex',
    alignContent: 'space-between',
    alignItems: 'center',
  },
}));

function EditForm(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [user, setUser] = React.useState({});
  const [formID, setFormID] = React.useState('');

  const [formDetails, setFormDetails] = React.useState({});
  const [openOfAlert, setOpenOfAlert] = React.useState(false);

  React.useEffect(() => {
    setUser(auth.getCurrentUser);
  }, []);

  const clipToClipboard = () => {
    navigator.clipboard.writeText(window.location.origin + '/s/' + formDetails._id);
    handleClickOfAlert();
    handleClose();
  };

  const handleClickOfAlert = () => {
    setOpenOfAlert(true);
  };

  const handleCloseOfAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenOfAlert(false);
  };

  function sendForm() {
    handleClickOpen();
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    var formId = props.match.params.formId;
    if (formId !== undefined) {
      setFormID(formId);
      formService.get(formId).then(
        (data) => {
          // console.log(data);
          setFormDetails(data);
          console.log(data);
        },
        (error) => {
          const resMessage =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
          console.log(resMessage);
        },
      );
    }
  }, [props.match.params.formId]);

  return (
    <>
      <NavigBar />
      <div>
        <div style={{ backgroundColor: '#e6e6e6' }}>
          <div className={classes.root}>
            <Typography variant="h6" noWrap style={{ marginTop: '8.5px', color: 'black' }}>
              {formDetails.name}
            </Typography>
            <CustomTabs
              handleChange={handleChange}
              value={value}
              tabs={['Questions', 'Responses']}
            />
          </div>
        </div>
        <div>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{'Copy and share link.'}</DialogTitle>
            <DialogContent>
              <Paper className={classes.paper}>
                <Grid container alignContent="space-between" alignItems="center">
                  <Grid item>
                    <Typography variant="body1">
                      {window.location.origin + '/s/' + formDetails._id}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <IconButton
                      className={classes.button}
                      aria-label="Add"
                      size="medium"
                      onClick={clipToClipboard}
                    >
                      <FilterNoneIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
              {/* <div style={{padding: '7px', display: 'flex'}}>
                  <Typography variant="body1">{window.location.origin + "/s/" + formDeatils._id}</Typography>
                    
                  <IconButton onClick={() =>  navigator.clipboard.writeText(window.location.origin + "/s/" + formDeatils._id)}  >
                    <MoreIcon />
                  </IconButton>
                  </div> */}

              <DialogContentText id="alert-dialog-description"></DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={openOfAlert}
            autoHideDuration={3000}
            onClose={handleCloseOfAlert}
            message="Copied to clipboard"
            action={
              <React.Fragment>
                <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={handleCloseOfAlert}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </React.Fragment>
            }
          />
        </div>
        <div>
          <TabPanel value={value} index={0}>
            <QuestionsTab formData={formDetails} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <ResponseTab formData={formDetails} formId={formID} />
          </TabPanel>
        </div>
      </div>
    </>
  );
}

export default EditForm;
