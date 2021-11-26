import loadErmData from './erm/index.js'

export default async (_, { erm = false }, ctx) => {
  const result = {}

  result.erm = erm ? await loadErmData(ctx) : false

  return result
}
