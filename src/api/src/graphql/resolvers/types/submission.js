export default {
  project: async ({ project = {} }) => JSON.parse(project),
  mitigation: async ({ mitigation = {} }) => JSON.parse(mitigation),
  adaptation: async ({ adaptation = {} }) => JSON.parse(adaptation),
  submissionStatus: async ({ submissionStatus = {} }) => JSON.parse(submissionStatus),

  /**
   * I think I only ever care about the userId
   * If more fields are required this will need
   * to be made into a batching function
   */
  createdBy: async ({ createdBy: id }) => ({ id }),
}
