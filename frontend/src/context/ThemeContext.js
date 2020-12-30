import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';

const TwitterTrackerTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#6FC9E7',
    },
    secondary: {
        main: '#FECCA8',
    }
  },
  status: {
    danger: '#ff0033',
  },
});

const ThemeContext = ({ children }) => {
  return <ThemeProvider theme={TwitterTrackerTheme}>{children}</ThemeProvider>;
};

export default ThemeContext;
