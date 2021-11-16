export default {
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  shape: {
    borderRadius: 2,
  },
  palette: {
    mode: 'light',
    contrastThreshold: 3,
    primary: {
      main: 'rgb(0, 93, 40)',
    },
    secondary: {
      main: 'rgb(224, 31, 22)',
    },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        h1: {
          fontsize: '2rem',
        },
      },
    },
  },
}
