import theme from './default-theme.js'
import frontMatter from './front-matter.js'
import { pool } from '../pool.js'
import { HOSTNAME, DEFAULT_SHORTNAME } from '../../config/index.js'

export default async () =>
  await (await pool.connect())
    .request()
    .input('hostname', new URL(HOSTNAME).hostname)
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
        1 isDefault,
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
          isDefault,
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
          s.isDefault,
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
          t.isDefault = s.isDefault,
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
