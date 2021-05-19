import createPool from '../../../../mssql/pool.js'

const createIterator = createPool({ database: 'VMS', batchSize: 1 })

export default async (_, args, ctx) => {
  const { query } = ctx.mssql

  // Provinces
  let iterator = await createIterator('select * from provinces')
  while (!iterator.done) {
    const { rows, next } = iterator

    for (const {
      WKT_PR: geometry,
      WKT_PR_simple: geometry_simplified,
      PR_NAME: name,
      PR_MDB_C: shortname,
    } of rows) {
      await query(`
        begin transaction province_geometries
        begin try

          merge Geometries t
          using (
            select
              '${name}' name,
              '${shortname}' shortname,
              geometry::STGeomFromText('${geometry}', 4326) geometry,
              geometry::STGeomFromText('${geometry_simplified}', 4326) geometry_simplified
          ) s on s.name = t.name
          when not matched then insert (
            name,
            shortname,
            geometry,
            geometry_simplified
          )
          values (
            s.name,
            s.shortname,
            s.geometry,
            s.geometry_simplified
          );

        commit transaction province_geometries;
        end try
        begin catch
          rollback transaction province_geometries;
        end catch
        `)
    }

    iterator = await next()
  }

  return iterator.result
}
