import finder from '../../../lib/find-vocabulary-helper.js'
import { mitigationVocabularyFields } from '../../schema/vocabulary-fields.js'

export default {
  ...Object.fromEntries(
    mitigationVocabularyFields.map(field => {
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
