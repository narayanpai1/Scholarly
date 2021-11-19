import React from 'react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Logo from './Logo';
import Divider from '@mui/material/Divider';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Link from '@mui/material/Link';

export default function DrawerBar(props) {
  let { options, window, open, handleDrawerToggle } = props;

  const container = window !== undefined ? () => window().document.body : undefined;

  const drawer = (
    <div>
      <Logo />
      <List>
        {options.map((option, index) => (
          <>
            <ListItemButton component={Link} href="https://www.google.com" key={option.text}>
              <ListItemText primary={option.text} />
            </ListItemButton>
            <Divider />
          </>
        ))}
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { sm: props.drawerWidth },
        flexShrink: { sm: 0 },
        display: { xs: 'block', sm: 'none' },
      }}
    >
      <Drawer
        container={container}
        variant="temporary"
        open={open}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            color: 'white',
            boxSizing: 'border-box',
            width: props.drawerWidth,
            backgroundColor: '#1976d2',
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
