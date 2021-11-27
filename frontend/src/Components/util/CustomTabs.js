import React from 'react';

import { makeStyles } from '@mui/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const useStyles = makeStyles(() => ({
  title: {
    flexGrow: 1,
    alignSelf: 'flex-end',
    justifySelf: 'center',
  },
}));


/***
 * The component listing different tabs. 
 * Used with TabPanel to produce different tabs
 */
export default function CustomTabs(props) {
  const classes = useStyles();
  let { handleChange, value, tabs } = props;

  return (
    <div>
      <Tabs
        className={classes.title}
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        centered
        sx={{
          '.MuiTabs-scroller': {
            overflow: 'auto !important',
          },
          '.MuiTabs-flexContainer': {
            justifyContent: 'flex-start',
          },
          backgroundColor: '#d9d9d9',
        }}
      >
        {tabs.map((tab, i) => {
          return (
            <Tab
              label={tab}
              key={i}
              style={{
                textTransform: 'capitalize',
                margin: 0,
              }}
            />
          );
        })}
      </Tabs>
    </div>
  );
}
