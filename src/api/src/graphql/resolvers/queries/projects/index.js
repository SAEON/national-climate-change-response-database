import logSql from '../../../../lib/log-sql.js'
import getFieldSelections from './get-field-selections.js'
import buildQuery, { getFinalProjection } from './build-query.js'

/**
 * https://stackoverflow.com/a/48011514/3114742
 *
 * TODO. Fragments and inline fragments as part
 * of the GraphQL query will cause this to fail
 * because the SQL is built dynamically using the
 * GraphQL field selection (but only normal fields)
 * are currently considered.
 *
 * To fix this (shouldn't be too hard), look for
 * 'TODO - merge field types'
 */

export default async (
  _,
  {
    limit = undefined,
    offset = undefined,
    ids = [],
    vocabularyFilters = [],
    mitigationFilters = undefined,
    adaptationFilters = undefined,
    distinct = false,
  },
  ctx,
  info
) => {
  let isPaginated = false
  const { query } = ctx.mssql

  const {
    project: projectFields,
    mitigations: mitigationsFields = [],
    adaptations: adaptationsFields = [],
  } = getFieldSelections(
    info.fieldNodes.find(({ name }) => (name.value = 'projects')).selectionSet.selections
  )

  /**
   * Validate pagination args (if included)
   */
  if (typeof limit === 'number' || typeof offset === 'number') {
    if (isNaN(parseInt(limit, 10)) || isNaN(parseInt(offset, 10))) {
      throw new Error(
        'Either BOTH limit and offset args must be defined, or NEITHER must be defined'
      )
    }

    if (!projectFields.includes('id')) {
      throw new Error('If limit & offset are specified, then the field selection MUST include id')
    }

    isPaginated = true
  }

  const _projectFields = [...new Set([...projectFields, 'id'])]
  const _mitigationsFields = [...new Set([...(mitigationsFields || []), 'projectId'])]
  const _adaptationsFields = [...new Set([...(adaptationsFields || []), 'projectId'])]

  const { ids: mitigationIds = [], vocabularyFilters: mitigationVocabularyFilters = [] } =
    mitigationFilters || {}

  const { ids: adaptationIds = [], vocabularyFilters: adaptationVocabularyFilters = [] } =
    adaptationFilters || {}

  const sql = `
    ;with

    _projects as (
      ${buildQuery({ fields: _projectFields, table: 'Projects', ids, vocabularyFilters })}
    ),
    
    _mitigations as (
      ${buildQuery({
        fields: _mitigationsFields,
        table: 'Mitigations',
        ids: mitigationIds,
        vocabularyFilters: mitigationVocabularyFilters,
      })}
    ),
    
    _adaptations as (
      ${buildQuery({
        fields: _adaptationsFields,
        table: 'Adaptations',
        ids: adaptationIds,
        vocabularyFilters: adaptationVocabularyFilters,
      })}
    )
    
    select ${distinct ? 'distinct' : ''}
      ${getFinalProjection({ fields: projectFields, table: 'p' })}
      ${
        mitigationsFields.length
          ? `,( 
              select ${distinct ? 'distinct' : ''}
                ${getFinalProjection({
                  fields: mitigationsFields,
                  table: 'm',
                })} from _mitigations m where m.projectId = p.id for json path
            ) mitigations`
          : ''
      }
      ${
        adaptationsFields.length
          ? `,(
              select ${distinct ? 'distinct' : ''}
              ${getFinalProjection({
                fields: adaptationsFields,
                table: 'a',
              })} from _adaptations a where a.projectId = p.id for json path 
            ) adaptations`
          : ''
      }
    
    from _projects p
    
    where exists
      ${
        mitigationIds.length || mitigationVocabularyFilters.length
          ? `( select 1 from _mitigations m where m.projectId = p.id  )`
          : '( select 1 )'
      }
      ${
        adaptationIds.length || adaptationVocabularyFilters.length
          ? `and exists ( select 1 from _adaptations a where a.projectId = p.id )`
          : ''
      }

      ${
        isPaginated
          ? `
            order by id asc
            offset ${offset} rows
            fetch next ${limit} rows only`
          : ''
      }      
    
    for json path;`

  logSql(sql, 'Fetch projects')
  const result = await query(sql)
  const rows = result.recordset[0]
  return rows || []
}
