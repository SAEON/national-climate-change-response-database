import baseQuery from './_base-query.js'

export default MAX_PAGE_SIZE =>
  ({ limit = MAX_PAGE_SIZE, offset = 0, ...args }) => {
    return `
      select
      *
      from ${baseQuery(args)}    
      order by id asc
      offset ${offset} rows
      fetch next ${limit} rows only;`
  }
