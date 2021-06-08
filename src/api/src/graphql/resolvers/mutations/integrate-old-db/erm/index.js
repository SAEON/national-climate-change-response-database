import projects from './_projects.js'

export default async ctx => ({
  projects: await projects(ctx),
})
