import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Footer from '../../components/footer'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import useTheme from '@material-ui/core/styles/useTheme'

export default () => {
  const theme = useTheme()
  return (
    <>
      <Container>
        <Box my={2}>
          <Card variant="outlined" style={{ backgroundColor: theme.backgroundColor }}>
            <CardContent>
              {[...new Array(120)]
                .map(
                  () => `Cras mattis consectetur purus sit amet fermentum.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`
                )
                .join('\n')}
            </CardContent>
          </Card>
        </Box>
      </Container>
      <Footer />
    </>
  )
}
