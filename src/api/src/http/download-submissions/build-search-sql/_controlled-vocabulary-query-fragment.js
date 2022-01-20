export default ({ kind, i, field, path }) => {
  if (kind === 'LIST') {
    return `and s.id in (
      select
        id
      from (
        select
        id,
        json_value(p.[value], '$.term') ${field}
        from (
          select
          s.id,
          JSON_QUERY(s.${path}, '$.${field}') ${field}
          from Submissions s
        ) _1
        cross apply openjson(_1.${field}) p
      ) _2
      where _2.${field} = @${path}_${i}
    )`
  }

  return `and json_value(${path}, '$.${field}.term') = @${path}_${i}`
}
