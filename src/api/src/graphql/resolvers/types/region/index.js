export default {
  name: async ({ term, name }) => term || name, // NOTE - this is needed, don't change unless you know why 'term' is checked before 'name'
  vocabulary: async ({ vocabulary }) => JSON.parse(vocabulary),
}
