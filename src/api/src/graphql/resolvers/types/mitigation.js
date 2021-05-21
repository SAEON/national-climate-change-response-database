import finder from '../../../lib/find-vocabulary-helper.js'

const vocabularyFields = [
  'mitigationType',
  'mitigationSubType',
  'interventionStatus',
  'cdmMethodology',
  'cdmExecutiveStatus',
  'hostSector',
  'hostSubSectorPrimary',
  'hostSubSectorSecondary',
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
