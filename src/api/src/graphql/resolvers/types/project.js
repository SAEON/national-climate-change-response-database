import finder from '../../../lib/find-vocabulary-helper.js'
import { Projects as vocabularyFields } from '../vocabulary-fields.js'

export default {
  mitigation: async ({ mitigation = {} }) => mitigation,
  adaptation: async ({ adaptation = {} }) => adaptation,
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
