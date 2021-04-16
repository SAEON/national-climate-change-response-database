/**
 * For colors, specify a main
 * light and dark variants are
 * calculated automatically
 */
export default {
  shape: {
    borderRadius: 2,
  },
  MuiTypography: {
    variantMapping: {
      h1: 'h1',
      h2: 'h2',
      h3: 'h3',
      h4: 'h4',
      h5: 'h5',
      h6: 'h6',
      subtitle1: 'h2',
      subtitle2: 'h2',
      body1: 'span',
      body2: 'span',
    },
  },
  palette: {
    type: 'light',
    contrastThreshold: 3,
    primary: {
      main: 'rgb(46, 125, 50)',
    },
    secondary: {
      main: '#dee1e5',
    },
  },
  status: {
    danger: 'orange',
  },
}
