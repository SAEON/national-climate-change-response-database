import theme from './default-theme.js'
import { pool } from '../pool.js'
import { NCCRD_HOSTNAME } from '../../config.js'

export default async () =>
  await (await pool.connect())
    .request()
    .input('hostname', new URL(NCCRD_HOSTNAME).hostname)
    .input('title', 'National Climate Change Response Database')
    .input('shortTitle', 'NCCRD')
    .input('description', 'National Climate Change Response Database')
    .input('theme', JSON.stringify(theme)).query(`
      merge Tenants t
      using (
        select
        @hostname hostname,
        @title title,
        @shortTitle shortTitle,
        @description description,
        @theme theme
      ) s on s.hostname = t.hostname
      
      when not matched
        then insert (
          hostname,
          title,
          shortTitle,
          description,
          theme
        ) values (
          s.hostname,
          s.title,
          s.shortTitle,
          s.description,
          s.theme
        )

      when matched
        then update set
          t.title = s.title,
          t.shortTitle = s.shortTitle,
          t.description = s.description,
          t.theme = s.theme;`)
