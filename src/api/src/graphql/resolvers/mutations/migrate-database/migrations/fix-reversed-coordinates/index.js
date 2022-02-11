import { pool } from '../../../../../../mssql/pool.js'
import mssql from 'mssql'
import wkt from 'wkt'

/**
 * The heatmap on the client shows that sometimes
 * the coordinates for a project are in the wrong
 * order. You can see this because the points appear
 * just off the coast of Africa
 */
export default async () => {
  const transaction = new mssql.Transaction(await pool.connect())
  await transaction.begin()

  try {
    // Get all records regardless of whether submitted or not
    const records = (
      await transaction.request().query(`
        ;with s as (
          select
            s.id id,
            JSON_VALUE(s.project, '$.xy') xy
          from Submissions s
          where
            JSON_VALUE(s.project, '$.xy') is not null
            and JSON_VALUE(s.project, '$.xy') != 'GEOMETRYCOLLECTION ()'
        )
        
        select
          s.id,
          s.xy
        from s;`)
    ).recordset

    // Loop through all XYs
    for (const { id, xy } of records) {
      const _xy = wkt.parse(xy)
      const correctedXy_ = {
        ..._xy,
        geometries: _xy.geometries.map(({ coordinates: [a, b], ...fields }) => {
          return {
            ...fields,
            coordinates: a < 0 && b > 0 ? [Math.max(a, b), Math.min(a, b)] : [a, b],
          }
        }),
      }

      try {
        const correctedXy = wkt.stringify(correctedXy_)

        if (xy !== correctedXy) {
          console.log('id', id, correctedXy)
          // TODO - check this is working
          // Reset the JSON field in the submission
        }
      } catch (error) {
        console.error('Invalid GeoJSON (probably) or unexpected error', correctedXy_)
        throw error
      }
    }
  } catch (error) {
    console.error('Unable to fix reverse coordinates (failed DB migration script)', error)
    await transaction.rollback()
    throw error
  }
}
