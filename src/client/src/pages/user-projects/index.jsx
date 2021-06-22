import Wrapper from '../../components/page-wrapper'
import { gql, useQuery } from '@apollo/client'
import Header from './header'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Loading from '../../components/loading'

export default ({ id }) => {
  const { error, loading, data } = useQuery(
    gql`
      query user($id: Int!) {
        user(id: $id) {
          id
          projects {
            id
          }
        }
      }
    `,
    {
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
        <Card>
          <CardContent>{JSON.stringify(data.user)}</CardContent>
        </Card>
      </Wrapper>
    </>
  )
}
