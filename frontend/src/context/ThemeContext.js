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
  status: {
    danger: '#ff0033',
    info: '#ffffff',
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
  palette: {
    type: 'light',
  },
  status: {
    danger: '#ff0033',
    info: '#ffffff',
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
