import { makeDataFinders } from '../mssql/data-loaders/index.js'
import { pool } from '../mssql/pool.js'
import schema, {
  projectInputFields,
  mitigationInputFields,
  adaptationInputFields,
  projectVocabularyFieldsTreeMap,
  mitigationVocabularyFieldsTreeMap,
  adaptationVocabularyFieldsTreeMap,
} from '../graphql/schema/index.js'
import userModel from '../user-model/index.js'

/**
 * Look in middleware/cors.js
 * to see where app.context.tenant
 * is set (avoids unnecessary DB trip)
 */

export default app => async (ctx, next) => {
  app.context.userInfo = ctx.state.user

  app.context.gql = {
    schema,
    inputFields: {
      project: {
        fields: projectInputFields,
        vocabularyFields: projectVocabularyFieldsTreeMap,
      },
      mitigation: {
        fields: mitigationInputFields,
        vocabularyFields: mitigationVocabularyFieldsTreeMap,
      },
      adaptation: {
        fields: adaptationInputFields,
        vocabularyFields: adaptationVocabularyFieldsTreeMap,
      },
    },
  }

  app.context.mssql = {
    dataFinders: makeDataFinders(), // Request level batching
    pool,
  }

  app.context.user = userModel

  await next()
}
