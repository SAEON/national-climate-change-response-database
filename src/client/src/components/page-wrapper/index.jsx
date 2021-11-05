import Box from '@mui/material/Box'
import Container from '@mui/material/Container'

export default ({ children, paddingBottom = 8, py = 2 }) => {
  return (
    <Container>
      <Box py={py} paddingBottom={paddingBottom}>
        {children}
      </Box>
    </Container>
  )
}
