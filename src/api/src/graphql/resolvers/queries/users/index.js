export default async (_, { ids = [] }, ctx) => {
  const { pool } = ctx.mssql

  return await pool.connect().then(async pool => {
    const request = pool.request()
    ids.forEach((id, i) => request.input(`id_${i}`, id))

    const result = await pool.query(`
      select u.*
      from Users u
      ${
        ids.length
          ? `
            where 
            u.id in (${ids.map((_, i) => `@id_${i}`)})`
          : ''
      }`)

    return result.recordset
  })
}
