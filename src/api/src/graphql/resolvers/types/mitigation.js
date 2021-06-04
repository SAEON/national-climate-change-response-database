import finder from '../../../lib/find-vocabulary-helper.js'
import { Mitigations as vocabularyFields } from '../vocabulary-fields.js'

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
