import { Suspense } from 'react'
import Fade from '@material-ui/core/Fade'
import Loading from '../../components/loading'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'

export default ({ children, tKey }) => {
  return (
    <Fade key={tKey} in={true}>
      <div>
        <Suspense fallback={<Loading />}>
          <Container>
            <Box py={2} paddingBottom={8}>
              {children}
            </Box>
          </Container>
        </Suspense>
      </div>
    </Fade>
  )
}
