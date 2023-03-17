export async function resolve(specifier, ctx, nextResolve) {
  const { url } = await nextResolve(specifier, ctx)
  const format = url.endsWith('.geojson') ? 'json' : null
  return { url, format }
}
