import { useContext } from 'react'
import { context as authContext } from '../../../contexts/authentication'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { gql, useQuery } from '@apollo/client'
import Loading from '../../../components/loading'
import useTheme from '@material-ui/core/styles/useTheme'

export default () => {
  const isAuthenticated = useContext(authContext).authenticate()

  if (!isAuthenticated) {
    return null
  }

  const theme = useTheme()

  const { error, loading, data } = useQuery(gql`
    query users {
      users {
        id
        username
      }
    }
  `)

  if (loading) {
    return <Loading />
  }

  if (error) {
    throw error
  }

  return (
    <Card style={{ width: '100%', backgroundColor: theme.backgroundColor }} variant="outlined">
      <CardContent>{JSON.stringify(data)}</CardContent>
    </Card>
  )
}
