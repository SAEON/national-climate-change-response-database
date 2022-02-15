import { pool } from '../../../../../../mssql/pool.js'
import mssql from 'mssql'
import OL from 'ol/format/WKT.js'
import wkt from 'wkt'
import PERMISSIONS from '../../../../../../user-model/permissions.js'

/**
 * The heatmap on the client shows that sometimes
 * the coordinates for a project are in the wrong
 * order. You can see this because the points appear
 * just off the coast of Africa
 */
export default async ctx => {
  const { user } = ctx
  const { ensurePermission } = user
  await ensurePermission({ ctx, permission: PERMISSIONS['migrate-database'] })

  const ol = new OL()
  const transaction = new mssql.Transaction(await pool.connect())
  await transaction.begin()

  try {
    // Get all records regardless of whether submitted or not
    const records = (
      await transaction.request().query(`
        ;with s as (
          select
            s.id id,
            JSON_VALUE(s.project, '$.xy') xy,
            r.[geometry].Reduce(0.005).STEnvelope().STBuffer(1).STAsText() region
          from Submissions s
          join TenantXrefSubmission x on x.submissionId = s.id
          join Tenants t on t.id = x.tenantId
          join Regions r on r.id = t.regionId
          where
            JSON_VALUE(s.project, '$.xy') is not null
            and JSON_VALUE(s.project, '$.xy') != 'GEOMETRYCOLLECTION ()'
      )
                    
      select
        s.id,
        s.xy,
        s.region
      from s;`)
    ).recordset

    // Loop through all XYs
    for (const { id, xy, region } of records) {
      const xyGeometry = ol.readGeometry(xy, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:4326',
      })

      const regionGeometry = ol.readGeometry(region, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:4326',
      })

      if (!regionGeometry.intersectsExtent(xyGeometry.getExtent())) {
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

        const correctedXy = wkt.stringify(correctedXy_)
        console.info('Fixing', id, xy, correctedXy)
        await transaction.request().input('id', id).input('xy', correctedXy).query(`
          update Submissions
          set project = JSON_MODIFY(project, '$.xy', @xy)
          where id = @id;`)
      }
    }

    await transaction.commit()
  } catch (error) {
    console.error('Unable to fix reverse coordinates (failed DB migration script)', error)
    await transaction.rollback()
    throw error
  }
}
