import { createTheme } from '@mui/material';
import { theme as globalTheme } from './GlobalTheme';

const theme = createTheme({
  typography: {
    fontFamily: ['BCSans', 'Verdana', 'Arial', 'sans-serif'].join(','),
  },
  components: {
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          display: 'flex',
          justifyContent: 'space-between',
          backgroundColor: globalTheme.color.navigationBlue,
          color: globalTheme.color.white,
          fontSize: 'inherit',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          textAlign: 'left',
          marginTop: globalTheme.spacing.large,
          paddingBottom: 0,
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          justifyContent: 'center',
          padding: `${globalTheme.spacing.large} ${globalTheme.spacing.medium}`,
          paddingTop: 0,
        },
      },
    },
  },
});

export default theme;
