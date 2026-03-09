import { createTheme } from '@mui/material/styles';

export default createTheme({
  palette: {
    primary: { main: '#1565C0' },
    secondary: { main: '#FF6F00' },
    background: { default: '#F5F7FA' },
    text: { primary: '#1A1A2E' }
  },
  typography: {
    fontFamily: '"Source Sans Pro", sans-serif',
    h1: { fontFamily: '"Montserrat", sans-serif' },
    h2: { fontFamily: '"Montserrat", sans-serif' },
    h3: { fontFamily: '"Montserrat", sans-serif' }
  }
});
