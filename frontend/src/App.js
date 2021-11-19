import React from 'react';
import Main from './Main';

import './App.css';
import { ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material';
import UserContextProvider from './store/UserContext';
import { blue } from '@mui/material/colors';

const theme = createTheme({
  // palette: {
  //   primary: blue,
  // },
});
function App() {
  return (
    <div className="App">
      <UserContextProvider>
        <ThemeProvider theme={theme}>
          <Main />
        </ThemeProvider>
      </UserContextProvider>
    </div>
  );
}

export default App;
