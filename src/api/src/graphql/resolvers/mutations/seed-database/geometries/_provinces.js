import createPool from '../../../../../mssql/pool.js'

export default async ctx => {
  console.info('Loading provincial geometries')
  const { query } = ctx.mssql
  const createIterator = createPool({ database: 'VMS', batchSize: 1 })

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

        merge GeometryXrefVocabularyTreeX t
        using (
          select
            ( select
              vxt.id
              from Vocabulary v
              join VocabularyXrefTree vxt on vxt.vocabularyId = v.id
              join VocabularyTrees t on vxt.vocabularyTreeId = t.id
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

        commit transaction province_geometries;
        end try
        begin catch
          rollback transaction province_geometries;
        end catch`)
    }

    iterator = await next()
  }

  return iterator.result
}
