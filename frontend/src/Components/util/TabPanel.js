import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';


/***
 * The component to emulate different tabs.
 * It is a simple div that shows the content only when the tab value and index match
 */
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && (
        <Box>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default TabPanel;
