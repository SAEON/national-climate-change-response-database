import { stringify } from 'wkt'

export default async (transaction, { properties, geometry }) =>
  transaction
    .request()
    .input('geometry', stringify(geometry))
    .input('properties', JSON.stringify(properties)).query(`
      merge Geometries t
      using (
        select
          @properties properties,
          @geometry geometry
      ) s on json_value(s.properties, '$.CODE') = json_value(t.properties, '$.CODE')

      when not matched
        then insert (
          properties,
          geometry
        )
        values (
          s.properties,
          s.geometry
        )

      when matched
          then update set
            t.properties = s.properties,
            t.geometry = s.geometry;`)
