import theme from './default-theme.js'
import { pool } from '../pool.js'

export default async () =>
  await (await pool.connect())
    .request()
    .input('theme', JSON.stringify(theme))
    .input('name', 'default').query(`
      merge MuiThemes t
      using (
        select
          @name name,
          @theme theme
      ) s on s.name = t.name
      
      when not matched then insert (name, theme)
        values (s.name, s.theme)

      when matched then update
        set
          t.theme = s.theme;`)
