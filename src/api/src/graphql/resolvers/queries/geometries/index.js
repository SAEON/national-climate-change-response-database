import { pool } from '../../../../mssql/pool.js'

export default async () =>
  (
    await (await pool.connect()).request().query(`
      select
        id,
        properties,
        code,
        parentCode,
        name
      from Geometries;`)
  ).recordset
