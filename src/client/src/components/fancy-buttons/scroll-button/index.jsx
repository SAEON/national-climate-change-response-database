import { forwardRef } from 'react'
import { styled, keyframes } from '@mui/material/styles'
import ButtonBase from '@mui/material/ButtonBase'

const animation = keyframes`
  0% {
    transform: translate(0, 0);
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
  80% {
    transform: translate(0, 20px);
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
`

const Button = styled(ButtonBase)(({ theme }) => ({
  cursor: 'pointer',
  display: 'block',
  left: '50%',
  zIndex: 2,
  transform: 'translate(0, -50%)',
  color: theme.palette.common.white,
  transition: theme.transitions.create('opacity'),
}))

const StyledSpan = styled('span')(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: '50%',
  width: '30px',
  height: '50px',
  marginLeft: '-15px',
  border: `2px solid ${theme.palette.common.white}`,
  borderRadius: '50px',
  boxSizing: 'border-box',
  ':before': {
    position: 'absolute',
    top: '10px',
    left: '50%',
    content: '""',
    width: '6px',
    height: '6px',
    marginLeft: '-3px',
    backgroundColor: theme.palette.common.white,
    borderRadius: '100%',
    animation: `${animation} 2s infinite`,
    boxSizing: 'border-box',
  },
  ':after': {
    position: 'absolute',
    bottom: '-18px',
    left: '50%',
    width: '18px',
    height: '18px',
    content: '""',
    marginLeft: '-9px',
    borderLeft: `1px solid ${theme.palette.common.white}`,
    borderBottom: `1px solid ${theme.palette.common.white}`,
    transform: 'rotate(-45deg)',
    boxSizing: 'border-box',
  },
}))

export default forwardRef(({ sx = {}, onClick, ...otherProps }, ref) => {
  return (
    <Button
      sx={{
        ':hover': {
          opacity: '0.5 !important',
        },
        ...sx,
      }}
      ref={ref}
      onClick={onClick || undefined}
      {...otherProps}
    >
      <StyledSpan />
    </Button>
  )
})
