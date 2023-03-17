import { pool } from '../../../../../../mssql/pool.js'
import mssql from 'mssql'
import wkt from 'wkt'
import logger from '../../../../../../lib/logger.js'

/**
 * It's conventional to name geometry points as YX (Long/Lat)
 * in the GIS world. BUT Sql Server only allows XY points.
 *
 * Initially the NCCRD software imported data from the ERM DB
 * to use YX points, and also used to allow users to input YX
 * points. This script just changes YX to XY in the database
 */
export default async () => {
  const transaction = new mssql.Transaction(await pool.connect())
  await transaction.begin()

  try {
    // Get all records regardless of whether submitted or not
    const records = (
      await transaction.request().query(`
        ;with yxs as (
          select
            s.id,
            project,
            JSON_VALUE(s.project, '$.yx') yx,
            JSON_VALUE(s.project, '$.xy') xy
          from Submissions s
        )
        select
          *
        from yxs
        where
          yx is not null
          and xy is null;`)
    ).recordset

    for (const { id, project, yx } of records) {
      const _yx = wkt.parse(yx)
      const _xy = {
        ..._yx,
        geometries: _yx.geometries.map(({ coordinates: [y, x], ...fields }) => ({
          ...fields,
          coordinates: [x, y],
        })),
      }
      const xy = wkt.stringify(_xy)

      /**
       * Create xy field
       * delete yx field
       */
      const _project = JSON.parse(project)
      _project.xy = xy
      delete _project.yx

      /**
       * Update the table
       */
      await transaction.request().input('project', JSON.stringify(_project)).input('id', id).query(`
        update Submissions
          set project = @project
        where
          id = @id;`)

      logger.info('Updated Submissions.project', id)
    }

    await transaction.commit()
  } catch (error) {
    logger.error('Unable to complete the yx => xy field migration. Rolling back transaction', error)
    await transaction.rollback()
    throw error
  }
}
