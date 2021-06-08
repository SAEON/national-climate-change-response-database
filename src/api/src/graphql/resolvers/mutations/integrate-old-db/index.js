import loadGeometries from './geometries/index.js'
import loadErmData from './erm/index.js'

export default async (_, { geometry = false, erm = false }, ctx) => {
  const geometryData = geometry ? await loadGeometries(ctx) : false
  const ermData = erm ? await loadErmData(ctx) : false

  return {
    geometryData,
    ermData,
  }
}
