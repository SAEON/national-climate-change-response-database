import { useQuery, gql } from '@apollo/client'
import Loading from '../../components/loading'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'

export default ({ id }) => {
  const { error, loading, data } = useQuery(
    gql`
      query project($id: ID!) {
        project(id: $id) {
          id
        }
      }
    `,
    { variables: { id } }
  )

  if (loading) {
    return <Loading />
  }

  if (error) {
    throw error
  }

  return (
    <Container>
      <Box my={2}>{JSON.stringify(data)}</Box>
    </Container>
  )
}
