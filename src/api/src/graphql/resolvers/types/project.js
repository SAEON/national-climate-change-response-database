import finder from '../../../lib/find-vocabulary-helper.js'
import { Projects as vocabularyFields } from '../vocabulary-fields.js'

export default {
  mitigations: async ({ mitigations = [] }) => mitigations,
  adaptations: async ({ adaptations = [] }) => adaptations,
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
