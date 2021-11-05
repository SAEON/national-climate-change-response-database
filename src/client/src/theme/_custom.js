import { alpha } from '@mui/material/styles'

export default defaultTheme => ({
  link: {
    color: defaultTheme.palette.primary,
    display: 'inline-block',
    textDecoration: 'none',
    transition: `color ${defaultTheme.transitions.duration.standard}`,
    cursor: 'pointer',
  },
  linkActive: {
    color: defaultTheme.palette.text.primary,
    textDecoration: 'underline',
  },
  pre: {
    backgroundColor: defaultTheme.palette.grey[100],
    borderRadius: defaultTheme.shape.borderRadius,
    border: `1px solid ${defaultTheme.palette.grey[200]}`,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
    padding: defaultTheme.spacing(1),
  },
  backgroundColor: alpha(defaultTheme.palette.common.white, 0.9),
  boxShadow: '0px 0px 55px 0px rgba(0,0,0,0.29)',
})
