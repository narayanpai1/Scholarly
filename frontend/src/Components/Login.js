import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material';
import { GoogleLogin } from 'react-google-login';
import GoogleButton from 'react-google-button';
import { useHistory, Redirect } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';

import auth from '../services/authService';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

const idToText = {
  email: 'E-mail',
  password: 'Password',
  firstName: 'First Name',
};

const defaultHelpers = {
  email: '',
  password: '',
  firstName: '',
};

const profileTypeOptions = [
  { value: 'student', label: 'Student' },
  { value: 'teacher', label: 'Teacher' },
];

function LoginForm(props) {
  let history = useHistory();

  let [helpers, setHelpers] = React.useState(defaultHelpers);
  let [error, setError] = React.useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);
    const data = new FormData(event.currentTarget);

    let valid = true;
    let helpersTemp = Object.assign({}, defaultHelpers);
    ['email', 'password'].forEach((id) => {
      if (!data.get(id) || data.get(id) === '') {
        helpersTemp[id] = idToText[id] + ' is required';
        valid = false;
      }
    });

    setHelpers(helpersTemp);
    if (!valid) {
      return;
    }

    return auth
      .loginWithMail({
        email: data.get('email'),
        password: data.get('password'),
      })
      .then(() => {
        history.push('/home');
      })
      .catch(() => {
        setError('Incorrect Email or Password');
      });
  };

  return (
    <>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <div style={{ color: 'red' }}>{error}</div>
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          error={Boolean(helpers.email)}
          helperText={helpers.email}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          error={Boolean(helpers.password)}
          helperText={helpers.password}
        />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Sign In
        </Button>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link
              onClick={() => {
                props.setLoginForm(false);
              }}
              href="#"
              variant="body2"
            >
              {
                // eslint-disable-next-line quotes
                "Don't have an account? Sign Up"
              }
            </Link>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

function SignUpForm(props) {
  let history = useHistory();

  let [helpers, setHelpers] = React.useState(defaultHelpers);
  let [profileType, setProfileType] = React.useState('student');
  let [error, setError] = React.useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);
    const data = new FormData(event.currentTarget);
    console.log(data.get('profileType'));

    let valid = true;
    let helpersTemp = Object.assign({}, defaultHelpers);
    ['email', 'password', 'firstName'].forEach((id) => {
      if (!data.get(id) || data.get(id) === '') {
        helpersTemp[id] = idToText[id] + ' is required';
        valid = false;
      }
    });

    if (!helpersTemp['password'] && data.get('password') !== data.get('password2')) {
      helpersTemp['password'] = 'Passwords do not match';
      valid = false;
    }

    setHelpers(helpersTemp);
    if (!valid) {
      return;
    }

    return auth
      .signUp({
        email: data.get('email'),
        password: data.get('password'),
        name: data.get('firstName') + ' ' + data.get('lastName'),
        isStudent: data.get('profileType') === 'student',
      })
      .then(() => {
        history.push('/home');
      })
      .catch((res) => {
        if (res.response && res.response.data && res.response.data.message)
          setError(res.response.data.message);
      });
  };

  return (
    <>
      <Typography component="h1" variant="h5">
        Sign up
      </Typography>
      <div style={{ color: 'red' }}>{error}</div>
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="given-name"
              name="firstName"
              required
              fullWidth
              id="firstName"
              label="First Name"
              error={Boolean(helpers.firstName)}
              helperText={helpers.firstName}
              autoFocus
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              autoComplete="family-name"
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              error={Boolean(helpers.email)}
              helperText={helpers.email}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              required
              fullWidth
              name="profileType"
              label="You are a"
              value={profileType}
              onChange={(e) => {
                setProfileType(e.target.value);
              }}
              id="profileType"
            >
              {profileTypeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              error={Boolean(helpers.password)}
              helperText={helpers.password}
              autoComplete="new-password"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              name="password2"
              label="Confirm Password"
              type="password"
              id="password2"
              error={Boolean(helpers.password)}
              autoComplete="new-password"
            />
          </Grid>
        </Grid>
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Sign Up
        </Button>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link
              onClick={() => {
                props.setLoginForm(true);
              }}
              href="#"
              variant="body2"
            >
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default function SignInSide(props) {
  const [loginForm, setLoginForm] = React.useState(props.match.path.includes('login'));
  const [oAuthData, setOAuthData] = React.useState(null);
  let [profileType, setProfileType] = React.useState('student');

  let history = useHistory();

  const { from } = { from: { pathname: '/' } };

  const loginGoogle = (response) => {
    auth.loginWithGoogle(response).then(
      (res) => {
        console.log(res);
        if (res.data && res.data.accessToken) {
          history.push('/home');
        } else {
          setOAuthData(res.data);
        }
      },
      (error) => {
        const resMessage =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(resMessage);
      },
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    return loginGoogle({
      isStudent: data.get('profileType') === 'student',
      profileObj: Object.assign({}, oAuthData),
    });
  };

  const handleLoginFailure = () => {
    console.log('Failed to log in');
  };

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
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={6}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square>
          <Box
            sx={{
              margin: 4,
              marginRight: 8,
              marginLeft: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <img src="/Scholarly-logos.jpeg" width="23%" />
            {oAuthData && (
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <h2> Scholarly </h2>
                <TextField
                  select
                  required
                  fullWidth
                  label="You are a"
                  value={profileType}
                  onChange={(e) => {
                    setProfileType(e.target.value);
                  }}
                  id="profileType"
                >
                  {profileTypeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                  Start your journey!
                </Button>
              </Box>
            )}
            {!oAuthData && loginForm && (
              <LoginForm
                handleLoginFailure={handleLoginFailure}
                loginGoogle={loginGoogle}
                setLoginForm={setLoginForm}
              />
            )}
            {!oAuthData && !loginForm && (
              <SignUpForm
                handleLoginFailure={handleLoginFailure}
                loginGoogle={loginGoogle}
                setLoginForm={setLoginForm}
              />
            )}
            {!oAuthData && (
              <>
                <div style={{ fontSize: '15px', color: 'grey' }}>or</div>
                <GoogleLogin
                  clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                  render={(renderProps) => (
                    <GoogleButton
                      onClick={renderProps.onClick}
                      style={{ textAlign: 'center', alignSelf: 'center' }}
                      label="Connect with Google"
                    />
                  )}
                  buttonText="Login"
                  onSuccess={loginGoogle}
                  onFailure={handleLoginFailure}
                  cookiePolicy={'single_host_origin'}
                  responseType="code,token"
                />
              </>
            )}

            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
