import { lazy, Suspense, useContext, useState } from 'react'
import { context as authenticationContext } from '../../contexts/authentication'
import { gql, useQuery } from '@apollo/client'
import Header from './header'
import Loading from '../../components/loading'
import VerticalTabs from '../../packages/vertical-tabs'
import CompletedIcon from 'mdi-react/CheckCircleIcon'
import Container from '@mui/material/Container'
import IncompleteIcon from 'mdi-react/ProgressWrenchIcon'
import Fade from '@mui/material/Fade'
import { useTheme } from '@mui/material/styles'

const CompletedSubmissions = lazy(() => import('./completed-submissions'))
const InprogressSubmissions = lazy(() => import('./inprogress-submissions'))

const sections = [
  {
    primaryText: 'Completed submissions',
    secondaryText: 'Show your completed submissions',
    Icon: () => <CompletedIcon />,
    Render: CompletedSubmissions,
  },
  {
    primaryText: 'Incomplete submissions',
    secondaryText: 'Show your incomplete submissions (continue from previous)',
    Icon: () => <IncompleteIcon />,
    Render: InprogressSubmissions,
  },
]

export default () => {
  const [activeIndex, setActiveIndex] = useState(0)
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
      <div style={{ marginTop: theme.spacing(2) }} />
      <Container style={{ minHeight: 1000 }}>
        <VerticalTabs activeIndex={activeIndex} setActiveIndex={setActiveIndex} navItems={sections}>
          {sections.map(({ Render, primaryText }, i) => {
            return (
              <Suspense key={primaryText} fallback={<Loading />}>
                <Fade in={activeIndex === i} key={`loaded-${i}`}>
                  <span style={{ display: activeIndex === i ? 'inherit' : 'none' }}>
                    <Render active={activeIndex === i} submissions={data.user.submissions} />
                  </span>
                </Fade>
              </Suspense>
            )
          })}
        </VerticalTabs>
      </Container>
      <div style={{ marginTop: theme.spacing(2) }} />
    </>
  )
}
