import React from 'react';
import auth from '../services/authService';
import Logo from './util/Logo';
import DrawerBar from './util/DrawerBar';

import { makeStyles } from '@mui/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';

import CssBaseline from '@mui/material/CssBaseline';

import { useHistory } from 'react-router-dom';

import Button from '@mui/material/Button';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  accountName: {
    fontSize: 12,
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  newCourseButton: { float: 'right' },
}));

function Dashboard(props) {
  let history = useHistory();
  const isAuthenticated = auth.isAuthenticated();
  let options = [{ text: 'All Courses' }, { text: 'My Courses' }];
  const classes = useStyles();
  const [moreAnchorEl, setMoreAnchorEl] = React.useState(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const [user, setUser] = React.useState({});

  React.useEffect(() => {
    setUser(auth.getCurrentUser());
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isMobileMenuOpen = Boolean(moreAnchorEl);

  const logout = () => {
    var logoutConfirmation = window.confirm('Really want to logout?');

    if (logoutConfirmation) {
      auth.logout();
      history.push('/login');
    }
  };

  const handleMobileMenuClose = () => {
    setMoreAnchorEl(null);
  };

  const handleAccountMenuOpen = (event) => {
    setMoreAnchorEl(event.currentTarget);
  };

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={moreAnchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={logout}>
        <IconButton color="inherit">
          <AccountCircle />
        </IconButton>
        <p>Logout</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box>
      <CssBaseline />
      <AppBar color="primary" position="static" sx={{ borderBottom: 'white solid 1px' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: { xs: 'none', sm: 'contents' } }}>
            <Logo />
          </Box>
          <div className={classes.grow} />
          {/* {isAuthenticated && window.location.pathname === '/home' && (
            <div className={classes.sectionDesktop}>
              <Button color="inherit" sx={classes.navigButton}>
                All Courses
              </Button>
              <Button color="inherit" sx={classes.navigButton}>
                My Courses
              </Button>
            </div>
          )} */}
          {isAuthenticated && (
            <IconButton
              edge="end"
              aria-label="account of current user"
              color="inherit"
              onClick={handleAccountMenuOpen}
            >
              <div className={classes.accountName}>{user && user.name}</div>
              <AccountCircle />
            </IconButton>
          )}
          {!isAuthenticated && (
            <Button color="inherit" href="/login">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <DrawerBar
        drawerWidth={drawerWidth}
        options={options}
        open={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      {renderMobileMenu}
    </Box>
  );
}

export default Dashboard;
