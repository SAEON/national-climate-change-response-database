export default {
  properties: async ({ properties }) => JSON.parse(properties),
  geometry: async () => null, // TODO if needed. Retrieve geometries via batched call
}
