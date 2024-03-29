import React from 'react';

import { useHistory, Redirect } from 'react-router-dom';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Hidden from '@mui/material/Hidden';
import CardActionArea from '@mui/material/CardActionArea';

import auth from '../services/authService';
import NavigBar from '../Components/NavigBar';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      <Link color="inherit" href="https://www.linkedin.com/in/narayan-pai/">
        Narayan Pai
      </Link>
      {' © '}
      <Link color="inherit" href="https://github.com/narayanpai1">
        GitHub
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: 1,
  },
  card: {
    display: 'flex',
  },
  cardDetails: {
    flex: 1,
  },
  cardMedia: {
    width: 160,
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: '8, 0, 6',
  },
  heroButtons: {
    marginTop: 4,
  },
  footer: {
    backgroundColor: '#DAE0E2',
    padding: 2,
    position: 'relative',
    bottom: 0,
    right: 0,
    left: 0,
  },
  mainFeaturedPost: {
    position: 'relative',
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
    marginBottom: 4,
    backgroundImage:
      'url(https://images.pexels.com/photos/998641/pexels-photo-998641.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    padding: '10px',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,.3)',
  },
  mainFeaturedPostContent: {
    position: 'relative',
    padding: 3,
    color: 'white',
    [theme.breakpoints.up('md')]: {
      padding: 6,
      paddingRight: 0,
    },
  },
  buttons: {
    '& > *': {
      margin: 1,
    },
  },
  buttongg: {
    backgroundColor: 'teal',
    margin: 1,
  },
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: 2,
  },
  title: {
    flexGrow: 1,
  },
}));

/***
 * The landing page to the app whenever a user visits the website for the 
 * first time.
 * 
 * It contains link for sign-up, login and lists different features of the website.
 */
export default function LandingPage() {
  const classes = useStyles();
  let history = useHistory();

  function loginClick() {
    history.push('/login');
  }

  if (auth.isAuthenticated()) {
    return (
      <Redirect
        to={{
          pathname: '/home',
        }}
      />
    );
  }

  return (
    <>
      <NavigBar />
      <div>
        <main style={{ textAlign: 'start' }}>
          <div>
            <Paper className={classes.mainFeaturedPost}>
              {/* Increase the priority of the hero background image */}
              {
                <img
                  style={{ display: 'none' }}
                  src="https://images.pexels.com/photos/998641/pexels-photo-998641.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                  alt="gg"
                />
              }
              <div className={classes.overlay} />
              <Grid container>
                <Grid item sm={2}>
                  <img style={{ width: '100%' }} src="/Scholarly-logos_transparent.png" />
                </Grid>
                <Grid item sm={6}>
                  <div className={classes.mainFeaturedPostContent}>
                    <br />
                    <Typography component="h1" variant="h3" color="inherit" gutterBottom>
                      Scholarly
                    </Typography>
                    <Typography variant="h5" color="inherit" paragraph>
                      An online learning platform where anyone and everyone can learn something and
                      grow
                    </Typography>
                    <div className={classes.buttons}>
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.buttongg}
                        sx={{ margin: 1 }}
                        href="/signup"
                      >
                        Signup Now
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.buttongg}
                        onClick={loginClick}
                        sx={{ margin: 1 }}
                      >
                        Login
                      </Button>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Paper>
            <br></br>
            <br></br>

            <div style={{ margin: '0px 14px' }}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <CardActionArea component="a" href="/">
                    <Card className={classes.card}>
                      <div className={classes.cardDetails}>
                        <CardContent>
                          <Typography component="h2" variant="h5">
                            Take Class Tests with Ease
                          </Typography>
                          <Typography variant="subtitle1" style={{ color: 'teal' }}>
                            Organize!
                          </Typography>
                          <Typography variant="subtitle1" paragraph>
                            Conduct or attempt class tests right from your device.
                            <br />
                            With automatic grading and online submissions, conducting a test has
                            never been easier.
                          </Typography>
                        </CardContent>
                      </div>
                      <Hidden xsDown>
                        <CardMedia
                          className={classes.cardMedia}
                          image="/test.jpg"
                          title=""
                        />
                      </Hidden>
                    </Card>
                  </CardActionArea>
                </Grid>
                <Grid item xs={12} md={6}>
                  <CardActionArea component="a" href="/">
                    <Card className={classes.card}>
                      <div className={classes.cardDetails}>
                        <CardContent>
                          <Typography component="h2" variant="h5">
                            Conduct Virtual Classes for Free!
                          </Typography>
                          <Typography variant="subtitle1" style={{ color: 'teal' }}>
                            Interact!
                          </Typography>
                          <Typography variant="subtitle1" paragraph>
                            Getting virtual is the new trend.
                            With a feature packed meeting room tailor-made for education, even
                            learning and interacting can now be virtual.
                          </Typography>
                        </CardContent>
                      </div>
                      <Hidden xsDown>
                        <CardMedia
                          className={classes.cardMedia}
                          image="/meeting.jpg"
                          title=""
                        />
                      </Hidden>
                    </Card>
                  </CardActionArea>
                </Grid>
              </Grid>
            </div>
            <br></br>
          </div>
        </main>

        <footer className={classes.footer} style={{}}>
          <Typography variant="h6" align="center" gutterBottom>
            Scholarly
          </Typography>
          <div style={{ fontSize: '12px' }}>
            An Open source learning platform
            <br />
            No Copyright issue. This project is{' '}
            <Link color="inherit" href="https://github.com/narayanpai1/Scholarly">
              open source
            </Link>
            {'. '}
          </div>
          <Copyright />
        </footer>
      </div>
    </>
  );
}
