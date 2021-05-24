import finder from '../../../lib/find-vocabulary-helper.js'

const vocabularyFields = [
  'adaptationSector',
  'adaptationPurpose',
  'hazardFamily',
  'hazardSubFamily',
  'hazard',
  'subHazard',
]

export default {
  ...Object.fromEntries(
    vocabularyFields.map(field => {
      return [
        field,
        async (self, _, ctx) => {
          const id = self[`${field}Id`]
          return await finder(ctx, id)
        },
      ]
    })
  ),
}
