import children from './_children.js'
import geometry from './_geometry.js'

/**
 * The DB id field changes when
 * the vocabulary table is reset.
 * But the terms are unique and make
 * for a good primary key, so use them
 * in the GraphQL types. But joins in
 * the SQL should be done on Vocabulary.id
 *
 * ControlledVocabulary.id is used by Apollo
 * on the client side. But this ID is also
 * saved to the form JSON - but rather join
 * on the term (which is unique to the Vocab
 * table)
 *
 * The 'fake' ID that is used here MUST be
 * saved to the JSON forms so that when this
 * JSON is rehydrated (i.e. when someone edits
 * a response, the ID is needed by apollo and
 * should correspond to the type resolver - which
 * is this code).
 *
 * Sorry this is confusing! I want to be able to
 * drop and recreate the Vocabulary tables without
 * having to remap form responses that reference that
 * vocabulary
 */

export default {
  id: async ({ term }) => term,
  children,
  geometry,
}
