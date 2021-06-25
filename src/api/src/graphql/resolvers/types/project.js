import finder from '../../../lib/find-vocabulary-helper.js'
import { Projects as vocabularyFields } from '../vocabulary-fields.js'

export default {
  mitigation: async ({ mitigation = {} }) => JSON.parse(mitigation),
  adaptation: async ({ adaptation = {} }) => JSON.parse(adaptation),
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
