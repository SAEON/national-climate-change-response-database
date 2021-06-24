import createPool from '../../../../../mssql/pool.js'

export default async ctx => {
  console.info('Loading district municipalities')
  const { query } = ctx.mssql
  const createIterator = createPool({ database: 'VMS', batchSize: 1 })

  let iterator = await createIterator('select * from districts')
  while (!iterator.done) {
    const { rows, next } = iterator

    for (const {
      WKT_DC: geometry,
      WKT_DC_simple: geometry_simplified,
      name_code: name,
      dc_code: shortname,
    } of rows) {
      await query(`
        begin transaction district_municipal_geometries
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

        merge GeometryXrefVocabularyTreeX t
        using (
          select
            ( select
              vxt.id
              from Vocabulary v
              join VocabularyXrefTree vxt on vxt.vocabularyId = v.id
              join Trees t on vxt.treeId = t.id
              where
              t.name = 'regions'
              and v.term = '${name}'
            ) vocabularyXrefTreeId,
            ( select
              id
              from Geometries g
              where g.name = '${name}'
            ) geometryId   
        ) s on s.vocabularyXrefTreeId = t.vocabularyXrefTreeId and s.geometryId = t.geometryId
        when not matched then insert (
          vocabularyXrefTreeId,
          geometryId
        )
        values (
          s.vocabularyXrefTreeId,
          s.geometryId
        );

        commit transaction district_municipal_geometries;
        end try
        begin catch
          rollback transaction district_municipal_geometries;
        end catch`)
    }

    iterator = await next()
  }

  return iterator.result
}
