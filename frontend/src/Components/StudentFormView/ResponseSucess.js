import React from 'react';

import NavigBar from '../NavigBar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function ResponseSuccess() {
  return (
    <>
      <NavigBar />

      <div>
        <Typography variant="body1">Form submitted</Typography>
        <Typography variant="body2">Thanks for submiting form</Typography>
        <Button href="/login">Go to Dashboard</Button>
      </div>
    </>
  );
}
