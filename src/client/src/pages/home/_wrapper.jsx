import Box from '@mui/material/Box'
import Container from '@mui/material/Container'

export default ({ children, style }) => {
  return (
    <div style={style}>
      <Container>
        <Box py={12}>{children}</Box>
      </Container>
    </div>
  )
}
