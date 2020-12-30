import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';

const TwitterTrackerTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#1DA1F2',
    },
    secondary: {
        main: '#FECCA8',
    }
  },
  status: {
    danger: '#ff0033',
    info: "#ffffff"
  },
});

const ThemeContext = ({ children }) => {
  return <ThemeProvider theme={TwitterTrackerTheme}>{children}</ThemeProvider>;
};

export default ThemeContext;
