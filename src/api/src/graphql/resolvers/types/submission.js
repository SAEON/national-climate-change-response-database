export default {
  project: async ({ project = {} }) => JSON.parse(project),
  mitigation: async ({ mitigation = {} }) => JSON.parse(mitigation),
  adaptation: async ({ adaptation = {} }) => JSON.parse(adaptation),
}
