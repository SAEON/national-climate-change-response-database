import baseQuery from '../submissions/_base-query.js'

export default async (ctx, args) => {
  return `
    select
    count(*) submissionCount
    from ${await baseQuery(ctx, args)};`
}
