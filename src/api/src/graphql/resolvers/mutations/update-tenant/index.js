import { pool } from '../../../../mssql/pool.js'

export default async (
  self,
  {
    id,
    input: {
      hostname = undefined,
      title = undefined,
      shortTitle = undefined,
      frontMatter = undefined,
      description = undefined,
      theme = undefined,
    },
  }
) => {
  const request = (await pool.connect()).request()

  // ID must be provided to identify the row to update
  request.input('id', id)

  // Only update the columns provided as args
  if (hostname) request.input('hostname', hostname)
  if (title) request.input('title', title)
  if (shortTitle) request.input('shortTitle', shortTitle)
  if (frontMatter) request.input('frontMatter', JSON.stringify(frontMatter))
  if (description) request.input('description', description)
  if (theme) request.input('theme', JSON.stringify(theme))

  const sql = `
    update Tenants
    set
      hostname = ${hostname ? '@hostname' : 'hostname'},
      title = ${title ? '@title' : 'title'},
      shortTitle = ${shortTitle ? '@shortTitle' : 'shortTitle'},
      frontMatter = ${frontMatter ? '@frontMatter' : 'frontMatter'},
      description = ${description ? '@description' : 'description'},
      theme = ${theme ? '@theme' : 'theme'}
    where
      id = @id;`

  console.log('sql', sql)

  const update = await request.query(sql)

  return { id }
}
