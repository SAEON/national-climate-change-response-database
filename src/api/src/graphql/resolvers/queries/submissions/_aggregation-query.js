import baseQuery from './_base-query.js'

export default args => {
  return `
    select
    count(*) submissionCount
    from ${baseQuery(args)};`
}
