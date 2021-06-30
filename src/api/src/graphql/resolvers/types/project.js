import finder from '../../../lib/find-vocabulary-helper.js'
import { projectVocabularyFields } from '../../schema/vocabulary-fields.js'

export default {
  mitigation: async ({ mitigation = {} }) => JSON.parse(mitigation),
  adaptation: async ({ adaptation = {} }) => JSON.parse(adaptation),
  ...Object.fromEntries(
    projectVocabularyFields.map(field => [
      field,
      async (self, _, ctx) => await finder(ctx, self[`${field}Id`]),
    ])
  ),
}
