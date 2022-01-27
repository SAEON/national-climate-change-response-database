import { styled, keyframes } from '@mui/material/styles'
import { Div } from '../../html-tags'

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

const StyledA = styled('a')(({ theme }) => ({
  cursor: 'pointer',
  position: 'absolute',
  bottom: '20px',
  left: '50%',
  zIndex: 2,
  display: ' inline-block',
  transform: 'translate(0, -50%)',
  color: theme.palette.common.white,
  transition: theme.transitions.create('opacity'),
  ':hover': {
    opacity: '0.5',
  },
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

const Button = ({ ...props }) => {
  return (
    <Div {...props}>
      <StyledA>
        <StyledSpan />
      </StyledA>
    </Div>
  )
}

export default styled(Button)({})
