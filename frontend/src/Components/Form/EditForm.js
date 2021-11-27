import React from 'react';

import { makeStyles } from '@mui/styles';
import { Typography } from '@mui/material';

import QuestionsTab from './QuestionsTab';
import FormDetailsTab from './FormDetailsTab';
import ResponseTab from '../Response/ResponseTab';
import formService from '../../services/formService';
import TabPanel from '../util/TabPanel';
import CustomTabs from '../util/CustomTabs';
import NavigBar from '../NavigBar';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  toolbar: {
    minHeight: 128,
    alignItems: 'flex-start',
    paddingTop: 1,
  },
  title: {
    flexGrow: 1,
    alignSelf: 'flex-end',
    justifySelf: 'center',
  },
}));


/***
 * The component that lets the course instructor manage a test.
 * 
 * It containts two tabs: Questions and Responses
 */
function EditForm(props) {
  const classes = useStyles();
  const [tabIndex, setTabIndex] = React.useState(1);
  const [formID, setFormID] = React.useState('');
  
  // these form-details will be passed on to the children
  // as well so that they dont have to fetch again
  const [formDetails, setFormDetails] = React.useState({});

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // fetch the form firstly
  React.useEffect(() => {
    var formId = props.match.params.formId;
    if (formId !== undefined) {
      setFormID(formId);
      formService.get(formId).then(
        (data) => {
          setFormDetails(data);
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
            <Typography variant="div" noWrap style={{ marginTop: '8.5px', color: 'black' }}>
              {formDetails.description}
            </Typography>
            <CustomTabs
              handleChange={handleChange}
              value={tabIndex}
              tabs={['Test Details', 'Questions', 'Responses']}
            />
          </div>
        </div>
        <div></div>
        <div>
          <TabPanel value={tabIndex} index={0}>
            <FormDetailsTab formData={formDetails} setFormData={setFormDetails} />
          </TabPanel>
          <TabPanel value={tabIndex} index={1}>
            <QuestionsTab formData={formDetails} setFormData={setFormDetails} />
          </TabPanel>
          <TabPanel value={tabIndex} index={2}>
            <ResponseTab formData={formDetails} formId={formID} />
          </TabPanel>
        </div>
      </div>
    </>
  );
}

export default EditForm;
