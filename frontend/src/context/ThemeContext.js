import { useMemo } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider, CssBaseline } from '@material-ui/core';

const DarkTheme = createMuiTheme({
  typography: {
    fontFamily: 'Montserrat, Roboto, Helvetica, sans-serif',
  },
  palette: {
    type: 'dark',
    primary: {
      main: '#1DA1F2',
    },
    secondary: {
      main: '#FECCA8',
    },
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        html: {
          fontSize: 16,
        },
        body: {
          background: "#303030"
        }
      },
    },
  },
});

const LightTheme = createMuiTheme({
  typography: {
    fontFamily: 'Montserrat, Roboto, Helvetica, sans-serif',
  },
  palette: {
    type: 'light',
    primary: {
      main: '#4287f5',
    },
    secondary: {
      main: '#f5426f',
    },
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        html: {
          fontSize: 16,
        },
      },
    },
  },
  
});

const ThemeContext = ({ children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(() => (prefersDarkMode ? DarkTheme : LightTheme), [
    prefersDarkMode,
  ]);
  return <ThemeProvider theme={theme}><CssBaseline/>{children}</ThemeProvider>;
};

export default ThemeContext;
