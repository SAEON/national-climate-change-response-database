import theme from './default-theme.js'
import { pool } from '../pool.js'
import { NCCRD_HOSTNAME, DEFAULT_SHORTNAME } from '../../config.js'

export default async () =>
  await (await pool.connect())
    .request()
    .input('hostname', new URL(NCCRD_HOSTNAME).hostname)
    .input('title', 'National Climate Change Response Database')
    .input('shortTitle', DEFAULT_SHORTNAME)
    .input('description', 'National Climate Change Response Database')
    .input('logoUrl', 'http/public-image/dffe-logo.jpg')
    .input('flagUrl', 'http/public-image/sa-flag.jpg')
    .input('theme', JSON.stringify(theme)).query(`
      merge Tenants t
      using (
        select
        @hostname hostname,
        @title title,
        @shortTitle shortTitle,
        @description description,
        @logoUrl logoUrl,
        @flagUrl flagUrl,
        @theme theme
      ) s on s.hostname = t.hostname
      
      when not matched
        then insert (
          hostname,
          title,
          shortTitle,
          description,
          logoUrl,
          flagUrl,
          theme
        ) values (
          s.hostname,
          s.title,
          s.shortTitle,
          s.description,
          s.logoUrl,
          s.flagUrl,
          s.theme
        )

      when matched
        then update set
          t.title = s.title,
          t.shortTitle = s.shortTitle,
          t.description = s.description,
          t.logoUrl = s.logoUrl,
          t.flagUrl = s.flagUrl,
          t.theme = s.theme;`)
