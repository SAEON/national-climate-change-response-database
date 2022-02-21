import { formatSql } from '../../../../lib/log-sql.js'

const s = {
  project: 'project',
  mitigation: 'mitigation',
  adaptation: 'adaptation',
}

const objSql = path => `
  UPDATE Submissions
  SET ${path}=JSON_MODIFY( ${path}, @jsonField, JSON_QUERY(@newTerm) )
  where JSON_VALUE( ${path}, @jsonValueField )  = @incorrectTerm;`

const listSql = path => `
  ;with t1 as (
    select distinct
      id
    from Submissions s
    cross apply openjson(JSON_QUERY(s.project, @jsonField)) with (term nvarchar(4000) '$.term') p
    where
      p.term = @incorrectTerm
  )

  ,t2 as (
    select distinct
      s.id,
      case p.term
        when @incorrectTerm then @newTerm
        else p.term
      end term
    from Submissions s
    cross apply openjson(JSON_QUERY(s.project, @jsonField)) with (term nvarchar(4000) '$.term') p
    where
      s.id in (select id from t1)
  )

  ,t4 as (
    select
      id,
      ( select ( select term from t2 where t2.id = t3.id for json path ) ) terms
    from t2 t3
    group by
      id
  )

  UPDATE subs
  SET ${path}=JSON_MODIFY(${path}, @jsonField, JSON_QUERY(t4.terms))
  from Submissions subs
  inner join t4 on t4.id = subs.id;`

export default async (self, { term, field: pathAndField, incorrectTerm }, ctx) => {
  const [_path, field] = pathAndField.split('.')
  const jsonField = `$.${field}`
  const jsonValueField = `${jsonField}.term`
  const path = s[_path]

  if (!path) {
    throw new Error(`Incorrect JSON field specified. Possible SQL injection attempt: ${_path}`)
  }

  const { fields } = ctx.gql.inputFields[path]
  const isList = fields[field].kind === 'LIST'
  const newTerm = isList ? term : JSON.stringify({ term })

  return {
    params: {
      jsonField,
      jsonValueField,
      newTerm,
      incorrectTerm,
    },
    query: formatSql(isList ? listSql(path) : objSql(path)),
  }
}
