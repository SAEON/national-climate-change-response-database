import loadGeometries from './geometries/index.js'

export default async (_, args, ctx) => {
  const provinces = await loadGeometries(ctx)

  return {
    provinces,
  }
}
