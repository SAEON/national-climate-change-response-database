import { Suspense } from 'react'
import Fade from '@material-ui/core/Fade'
import Loading from '../../components/loading'
import Wrapper from '../../components/page-wrapper'

export default ({ children, tKey, nowrap }) => {
  if (nowrap) {
    return (
      <Fade key={tKey} in={true}>
        <div>
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </div>
      </Fade>
    )
  }

  return (
    <Fade key={tKey} in={true}>
      <div>
        <Suspense fallback={<Loading />}>
          <Wrapper>{children}</Wrapper>
        </Suspense>
      </div>
    </Fade>
  )
}
