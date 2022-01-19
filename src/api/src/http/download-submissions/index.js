import { Readable } from 'stream'
import PERMISSIONS from '../../user-model/permissions.js'
import { format } from 'date-fns'
import { pool } from '../../mssql/pool.js'
import parseRow from './parse-row/index.js'
import makeHeaderRow from './make-header-row/index.js'
import { stringify as stringifySync } from 'csv/sync'

const csvOptions = {
  delimiter: ',',
  quoted: true,
}

const stringifyRow = row => stringifySync([row], csvOptions)

/**
 * Stream downloads to user in CSV
 * form.
 */

export default async ctx => {
  const { user } = ctx
  const { ensurePermission } = user

  // await ensurePermission({ ctx, permission: PERMISSIONS['download-submission'] })

  const ids = decodeURIComponent(ctx.query.ids).split(',')

  if (!ids?.length) {
    ctx.response = 400
    return
  }

  console.info('Download requested by user', user.info(ctx).id, 'for IDS', ids.join(', '))

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
    { key: 'submissionStatus' },
    { key: 'submissionComments' },
    { key: 'submissionType' },
    { key: 'createdAt' },
    { key: 'userId' },
    { key: 'createdBy' },
    { key: 'research' },
    ...keys,
  ].reduce((map, { key }, i) => ({ ...map, [key]: i }), {})

  try {
    // Set up the download stream
    const dataStream = new Readable()
    dataStream._read = () => {} // https://stackoverflow.com/a/44091532/3114742
    ctx.body = dataStream
    ctx.attachment(`CCRD download ${format(new Date(), 'yyyy-MM-dd HH-mm-ss')}.csv`)

    // Push the CSV headers to the download
    dataStream.push(stringifyRow(makeHeaderRow({ columns })))

    // Create a MSSQL streaming query
    const request = (await pool.connect()).request()
    request.stream = true
    ids.forEach((id, i) => request.input(`id_${i}`, id))
    request.query(
      `select
        *
       from Submissions
       where
        id in (${ids.map((_, i) => `@id_${i}`).join(', ')})`
    )

    // Push rows to download one at a time
    request.on('row', submission => {
      dataStream.push(stringifyRow(parseRow({ submission, columns })))
    })

    request.on('error', error => {
      console.error('Error generating download for IDs', ids.join(';'), error.message)
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
