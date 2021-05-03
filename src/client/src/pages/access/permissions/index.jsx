import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { gql, useQuery } from '@apollo/client'
import Loading from '../../../components/loading'
import useTheme from '@material-ui/core/styles/useTheme'

export default () => {
  const theme = useTheme()

  const { error, loading, data } = useQuery(gql`
    query userPermissions {
      userPermissions {
        id
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
