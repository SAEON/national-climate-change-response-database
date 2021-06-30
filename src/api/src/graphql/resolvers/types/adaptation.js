import finder from '../../../lib/find-vocabulary-helper.js'
import { adaptationVocabularyFields } from '../../schema/vocabulary-fields.js'

export default {
  ...Object.fromEntries(
    adaptationVocabularyFields.map(field => {
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
