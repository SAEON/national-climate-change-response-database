import { lazy, Suspense, useContext } from 'react'
import { context as authenticationContext } from '../../contexts/authentication'
import Wrapper from '../../components/page-wrapper'
import { gql, useQuery } from '@apollo/client'
import Header from './header'
import Loading from '../../components/loading'
import ContentNav from '../../components/content-nav'
import CompletedIcon from 'mdi-react/CheckCircleIcon'
import IncompleteIcon from 'mdi-react/ProgressWrenchIcon'
import Fade from '@mui/material/Fade'
import { useTheme } from '@mui/material/styles'

const CompletedSubmissions = lazy(() => import('./completed-submissions'))
const InprogressSubmissions = lazy(() => import('./inprogress-submissions'))

const sections = [
  {
    primaryText: 'Completed submissions',
    secondaryText: 'Show your completed submissions',
    Icon: CompletedIcon,
    Section: CompletedSubmissions,
  },
  {
    primaryText: 'Incomplete submissions',
    secondaryText: 'Show your incomplete submissions (continue from previous)',
    Icon: IncompleteIcon,
    Section: InprogressSubmissions,
  },
]

export default () => {
  const theme = useTheme()
  const { user: { id = 0 } = {}, authenticate } = useContext(authenticationContext)
  const isAuthenticated = authenticate()

  if (!isAuthenticated) {
    return <Loading />
  }

  const { error, loading, data } = useQuery(
    gql`
      query user($id: Int!) {
        user(id: $id) {
          id
          submissions {
            id
            _id
            project
            submissionStatus
            submissionComments
            isSubmitted
          }
        }
      }
    `,
    {
      fetchPolicy: 'network-only',
      variables: {
        id: parseInt(id, 10),
      },
    }
  )

  if (loading) {
    return <Loading />
  }

  if (error) {
    throw error
  }

  return (
    <>
      <Header />
      <Wrapper>
        <ContentNav navItems={sections}>
          {({ activeIndex }) =>
            sections.map(({ Section, primaryText }, i) => (
              <Suspense
                key={primaryText}
                fallback={
                  <Fade
                    timeout={theme.transitions.duration.regular}
                    in={activeIndex === i}
                    key={'loading'}
                  >
                    <span>
                      <Loading />
                    </span>
                  </Fade>
                }
              >
                <Fade
                  timeout={theme.transitions.duration.regular}
                  in={activeIndex === i}
                  key={'loaded'}
                >
                  <span style={{ display: activeIndex === i ? 'inherit' : 'none' }}>
                    <Section submissions={data.user.submissions} />
                  </span>
                </Fade>
              </Suspense>
            ))
          }
        </ContentNav>
      </Wrapper>
    </>
  )
}
