import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'

export default ({ children, style }) => {
  return (
    <div style={style}>
      <Container>
        <Box py={12}>{children}</Box>
      </Container>
    </div>
  )
}
