import submissions from './_submissions.js'

export default async ctx => ({
  submissions: await submissions(ctx),
})
