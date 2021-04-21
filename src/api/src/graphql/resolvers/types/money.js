import { GraphQLScalarType, GraphQLError } from 'graphql'

export default new GraphQLScalarType({
  name: 'Money',
  description: 'Custom scalar type for Monetary values',
  parseValue(value) {
    const parsed = parseFloat(value)
    if (isNaN(parsed))
      throw new GraphQLError('GraphQL scalar type (Money) error: Cannot parse value')
    return parsed
  },
  serialize(value) {
    try {
      return value
    } catch (error) {
      console.GraphQLError(
        'Failed to parse Money field data from MongoDB. This should not occur',
        error
      )
    }
    return null
  },
  // eslint-disable-next-line
  parseLiteral(ast) {
    return null
  },
})
