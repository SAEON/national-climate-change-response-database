import { Suspense } from 'react'
import Fade from '@mui/material/Fade'
import Loading from '../../components/loading'

export default ({ children, tKey }) => (
  <Fade key={tKey} in={true}>
    <div>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </div>
  </Fade>
)
