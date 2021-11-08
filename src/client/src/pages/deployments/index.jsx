import { useContext } from 'react'
import { gql, useQuery } from '@apollo/client'
import { context as authenticationContext } from '../../contexts/authentication'
import { context as authorizationContext } from '../../contexts/authorization'
import Loading from '../../components/loading'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import AccessDenied from '../../components/access-denied'
import Header from './header'
import Templates from './uploads'
import useTheme from '@mui/material/styles/useTheme'

const POLLING_INTERVAL = 1000

export default () => {
  const theme = useTheme()
  const isAuthenticated = useContext(authenticationContext).authenticate()
  const { hasPermission } = useContext(authorizationContext)

  if (!isAuthenticated) {
    return <Loading />
  }

  if (!hasPermission('/deployments')) {
    return <AccessDenied requiredPermission="/deployments" />
  }

  const { error, loading, data, startPolling } = useQuery(
    gql`
      query submissionTemplates {
        submissionTemplates {
          id
          createdAt
          filePath
          createdBy {
            id
            emailAddress
          }
        }
      }
    `
  )

  if (loading) {
    return <Loading />
  }

  if (error) {
    throw error
  }

  startPolling(POLLING_INTERVAL)

  return (
    <>
      <Header />
      <div style={{ marginTop: theme.spacing(2) }} />
      <Container style={{ minHeight: 1000 }}>
        <Templates templates={data.submissionTemplates} />
        <div style={{ margin: 16 }} />
        <Card>
          <CardHeader title="Tenants" />
          <CardContent>
            <Typography variant="body2">
              This page will shows a list of deployments. Each tenant is basically a form that
              allows for (1) specifying a project filter (2) uploading a logo and (3) defining a
              domain name that this filter will be applied on. This will likely be implemented using
              the client-info api address, which will return the hostname that the website is being
              accessed on. This will then create a non-editable filter that is applied to projects,
              and will use the appropriate logo in the header. Also... might be a good way for
              specifying backgrounds that change according to deployment
            </Typography>
          </CardContent>
        </Card>
      </Container>
      <div style={{ marginTop: theme.spacing(2) }} />
    </>
  )
}
