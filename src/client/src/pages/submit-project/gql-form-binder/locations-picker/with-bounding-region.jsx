import { gql, useQuery } from '@apollo/client'
import Loading from '../../../../components/loading'

export default ({ children, boundingRegions = {} }) => {
  const {
    localMunicipality = {},
    districtMunicipality = {},
    province = {},
    country = { term: 'South Africa' },
  } = boundingRegions

  const term = localMunicipality.term || districtMunicipality.term || province.term || country.term

  const { error, loading, data } = useQuery(
    gql`
      query controlledVocabulary($term: String!, $tree: String!, $simplified: Boolean) {
        controlledVocabulary(root: $term, tree: $tree) {
          id
          term
          geometry(simplified: $simplified)
        }
      }
    `,
    { variables: { term, tree: 'regions', simplified: false } }
  )

  if (loading) {
    return <Loading />
  }

  if (error) {
    throw error
  }

  return children({ geometry: data.controlledVocabulary.geometry })
}
