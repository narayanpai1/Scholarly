import React from 'react';

import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import IconButton from '@mui/material/IconButton';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
}));

/**
 * A component containing home icon and app name
 */
export default function Logo() {
  const classes = useStyles();

  return (
    <>
      <IconButton
        edge="start"
        className={classes.menuButton}
        color="inherit"
        aria-label="open drawer"
        href="/home"
      >
        <HomeIcon />
      </IconButton>

      <Typography className={classes.title} variant="span" noWrap>
        Scholarly
      </Typography>
    </>
  );
}
