import { Readable } from 'stream'
import PERMISSIONS from '../../user-model/permissions.js'
import { format } from 'date-fns'
import { pool } from '../../mssql/pool.js'
import parseRow from './parse-row/index.js'
import makeHeaderRow from './make-header-row/index.js'
import { stringify as stringifySync } from 'csv/sync'
import buildSearchSql from './build-search-sql/index.js'
import logSql from '../../lib/log-sql.js'

const csvOptions = {
  delimiter: ',',
  quoted: true,
}

const sanitizeNewlines = val =>
  typeof val === 'string' ? val.replaceAll(/\r\n/g, '\\n').replaceAll(/\n/g, '\\n') : val

const stringifyRow = row => stringifySync([row.map(val => sanitizeNewlines(val))], csvOptions)

/**
 * Stream downloads to user in CSV form
 */
export default async ctx => {
  const { user } = ctx
  const { ensurePermission } = user

  // Check if user can see non-accepted projects
  let acceptedProjectsOnly = false
  try {
    await ensurePermission({ ctx, permission: PERMISSIONS['validate-submission'] })
  } catch (error) {
    acceptedProjectsOnly = true
  }

  let { ids, search } = ctx.request.body

  if (ids && search) {
    throw new Error(
      'Either specify a list of IDs to download, or a search object to resolve IDs (not both)'
    )
  }

  if (!ids?.length && !search) {
    ctx.response = 400
    return
  }

  const fieldBlackList = [
    'project.projectManagerTelephone',
    'project.projectManagerName',
    'project.projectManagerPosition',
    'project.projectManagerEmail',
    'project.projectManagerTelephone',
    'project.projectManagerMobile',
    'mitigation._ermDbEmissions',
  ]

  /**
   * Get a list of all keys
   */
  const keys = (
    await (await pool.connect()).request().query(`
      ;with keys as (
        select distinct concat('project.', p.[key]) [key]
        from Submissions s cross apply openjson(s.project) p
        union
        select distinct concat('mitigation.', m.[key]) [key]
        from Submissions s cross apply openjson(s.mitigation) m
        union
        select distinct concat('adaptation.', a.[key]) [key]
        from Submissions s cross apply openjson(s.adaptation) a
      )
      
      select [key]
      from keys
      order by [key] desc;`)
  ).recordset

  const columns = [
    { key: 'id' },
    { key: 'uri' },
    { key: 'submissionStatus' },
    ...keys.filter(({ key }) => !fieldBlackList.includes(key)),
    { key: 'createdAt' },
    { key: 'createdBy' },
  ].reduce((map, { key }, i) => ({ ...map, [key]: i }), {})

  try {
    // Set up the download stream
    const dataStream = new Readable()
    dataStream._read = () => {} // https://stackoverflow.com/a/44091532/3114742
    ctx.body = dataStream
    ctx.attachment(`CCRD download ${format(new Date(), 'yyyy-MM-dd HH-mm-ss')}.csv`) // This doesn't seem to go through to the client, when the client uses the fetch API

    /**
     * Push the CSV headers to the download
     *
     * NOTE - The CSV spec allows newlines in quoted fields.
     * But older Excel versions do not. So replace newlines with
     * escaped newlines
     **/
    dataStream.push(stringifyRow(makeHeaderRow({ columns })))

    // Create a MSSQL streaming query
    const request = (await pool.connect()).request()
    request.input('tenantId', ctx.tenant.id)
    request.stream = true

    let sql

    if (search) {
      sql = buildSearchSql({ search, request, acceptedProjectsOnly })
    } else {
      ids = JSON.parse(ctx.request.body.ids)
      ids.forEach((id, i) => request.input(`id_${i}`, id))
      sql = `
        select
          *
        from Submissions s
        join TenantXrefSubmission x on x.submissionId = s.id
        where
          x.tenantId = @tenantId
          and s.id in (${ids.map((_, i) => `@id_${i}`).join(', ')})
          ${
            acceptedProjectsOnly
              ? `and upper(JSON_VALUE(s.submissionStatus, '$.term')) = 'ACCEPTED'`
              : ''
          };`
    }

    logSql(sql, `Submission(s) download. User ID: ${user.info(ctx).id}`)

    request.query(sql)

    // Push rows to download one at a time
    request.on('row', submission => {
      dataStream.push(stringifyRow(parseRow({ ctx, submission, columns })))
    })

    request.on('error', error => {
      console.error(
        'Error generating download for IDs or search',
        ids?.join(';') || JSON.stringify(search),
        error.message
      )
      throw error
    })

    request.on('done', () => {
      dataStream.push(null)
    })
  } catch (error) {
    console.error(error.message)
    ctx.response.status = 404
  }
}
