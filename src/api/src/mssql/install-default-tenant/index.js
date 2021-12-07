import theme from './default-theme.js'
import frontMatter from './front-matter.js'
import { pool } from '../pool.js'
import { NCCRD_HOSTNAME, DEFAULT_SHORTNAME } from '../../config.js'
import mergeTenantsSubmissions from '../../lib/sql/merge-tenants-submissions.js'

export default async () => {
  const res = await (await pool.connect())
    .request()
    .input('hostname', new URL(NCCRD_HOSTNAME).hostname)
    .input('title', 'National Climate Change Response Database')
    .input('shortTitle', DEFAULT_SHORTNAME)
    .input('description', 'National Climate Change Response Database')
    .input('logoUrl', 'http/public-image/dffe-logo.jpg')
    .input('frontMatter', JSON.stringify(frontMatter))
    .input('flagUrl', 'http/public-image/sa-flag.jpg')
    .input('includeUnboundedSubmissions', 1)
    .input('theme', JSON.stringify(theme)).query(`
      merge Tenants t
      using (
        select
        @hostname hostname,
        @title title,
        @shortTitle shortTitle,
        @frontMatter frontMatter,
        @description description,
        @theme theme,
        @logoUrl logoUrl,
        @flagUrl flagUrl,
        ( select id from Regions where code = 'ZA') regionId,
        @includeUnboundedSubmissions includeUnboundedSubmissions
      ) s on s.hostname = t.hostname
      
      when not matched
        then insert (
          hostname,
          title,
          shortTitle,
          frontMatter,
          description,
          theme,
          logoUrl,
          flagUrl,
          regionId,
          includeUnboundedSubmissions
          
        ) values (
          s.hostname,
          s.title,
          s.shortTitle,
          s.frontMatter,
          s.description,
          s.theme,
          s.logoUrl,
          s.flagUrl,
          s.regionId,
          s.includeUnboundedSubmissions
        )

      when matched
        then update set
          t.title = s.title,
          t.shortTitle = s.shortTitle,
          t.frontMatter = s.frontMatter,
          t.description = s.description,
          t.theme = s.theme,
          t.logoUrl = s.logoUrl,
          t.flagUrl = s.flagUrl,
          t.regionId = s.regionId,
          t.includeUnboundedSubmissions = s.includeUnboundedSubmissions
          
      output
          $action,
          inserted.id;`)

  console.info('Installed default tenant. Configuring tenant...')

  await (
    await pool.connect()
  )
    .request()
    .input('tenantId', res.recordset[0].id)
    .input('submissionId', null) // This means "all submissions"
    .query(mergeTenantsSubmissions)
}
