import Box from '@mui/material/Box'
import Container from '@mui/material/Container'

export default ({ children }) => {
  return (
    <Container>
      <Box paddingTop={12} paddingBottom={12}>
        {children}
      </Box>
    </Container>
  )
}
