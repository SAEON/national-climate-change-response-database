import children from './_children.js'
import geometry from './_geometry.js'
import hash from 'object-hash'

export default {
  id: async ({ id, tree }) => hash({ id, tree }),
  children,
  geometry,
}
