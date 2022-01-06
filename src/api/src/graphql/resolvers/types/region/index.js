export default {
  name: async ({ term, name }) => term || name, // TODO - this is needed, but should be cleaned up or explained
  vocabulary: async ({ vocabulary }) => JSON.parse(vocabulary),
}
