import { useQuery, gql } from '@apollo/client'
import Loading from '../../components/loading'

export default ({ id }) => {
  const { error, loading, data } = useQuery(
    gql`
      query projects($ids: [ID!]) {
        projects(ids: $ids) {
          id
        }
      }
    `,
    { variables: { ids: [id] } }
  )

  if (loading) {
    return <Loading />
  }

  if (error) {
    throw error
  }

  return JSON.stringify(data)
}
