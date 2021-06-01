import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'

export default ({ children, paddingBottom = 8, py = 2 }) => {
  return (
    <Container>
      <Box py={py} paddingBottom={paddingBottom}>
        {children}
      </Box>
    </Container>
  )
}
