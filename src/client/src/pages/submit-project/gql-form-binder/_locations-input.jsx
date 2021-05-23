import { memo } from 'react'
import { gql, useQuery } from '@apollo/client'
import Loading from '../../../components/loading'

const WithBoundingRegion = ({ children, boundingRegions }) => {
  /**
   * Fetch all bounding region polygons, fallback from smallest to largest
   * for the geometry param passed to children
   *
   * TODO
   */

  const { error, loading, data } = useQuery(
    gql`
      query controlledVocabulary($root: String!, $tree: String!) {
        controlledVocabulary(root: $root, tree: $tree) {
          id
          term
          geometry
        }
      }
    `,
    { variables: { root: 'South Africa', tree: 'regions' } }
  )

  if (loading) {
    return <Loading />
  }

  if (error) {
    throw error
  }

  return children({ geometry: data.controlledVocabulary.geometry })
}

export default memo(
  ({ form }) => {
    const { localMunicipality, districtMunicipality, province } = form

    const boundingRegions = {
      country: 'South Africa',
      province,
      districtMunicipality,
      localMunicipality,
    }

    return (
      <WithBoundingRegion boundingRegions={boundingRegions}>
        {({ geometry }) => {
          return geometry
        }}
      </WithBoundingRegion>
    )
  },
  ({ form: a }, { form: b }) => {
    let _memo = true
    if (a.localMunicipality !== b.localMunicipality) _memo = false
    if (a.districtMunicipality !== b.districtMunicipality) _memo = false
    if (a.province !== b.province) _memo = false
    return _memo
  }
)
