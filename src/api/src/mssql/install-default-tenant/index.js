import theme from './default-theme.js'
import frontMatter from './front-matter.js'
import geofence from './default-geofence.js'
import { pool } from '../pool.js'
import { NCCRD_HOSTNAME, DEFAULT_SHORTNAME } from '../../config.js'
import { stringify } from 'wkt'

export default async () => {
  const geofenceWKT = stringify(geofence.features[0].geometry)

  await (await pool.connect())
    .request()
    .input('hostname', new URL(NCCRD_HOSTNAME).hostname)
    .input('title', 'National Climate Change Response Database')
    .input('shortTitle', DEFAULT_SHORTNAME)
    .input('description', 'National Climate Change Response Database')
    .input('logoUrl', 'http/public-image/dffe-logo.jpg')
    .input('frontMatter', JSON.stringify(frontMatter))
    .input('flagUrl', 'http/public-image/sa-flag.jpg')
    .input('geofence', geofenceWKT)
    .input('theme', JSON.stringify(theme)).query(`
      merge Tenants t
      using (
        select
        @hostname hostname,
        @title title,
        @shortTitle shortTitle,
        @frontMatter frontMatter,
        @description description,
        @theme theme,
        @logoUrl logoUrl,
        @flagUrl flagUrl,
        geometry::STGeomFromText(@geofence, 4326) geofence
      ) s on s.hostname = t.hostname
      
      when not matched
        then insert (
          hostname,
          title,
          shortTitle,
          frontMatter,
          description,
          theme,
          logoUrl,
          flagUrl,
          geofence
          
        ) values (
          s.hostname,
          s.title,
          s.shortTitle,
          s.frontMatter,
          s.description,
          s.theme,
          s.logoUrl,
          s.flagUrl,
          s.geofence
        )

      when matched
        then update set
          t.title = s.title,
          t.shortTitle = s.shortTitle,
          t.frontMatter = s.frontMatter,
          t.description = s.description,
          t.theme = s.theme,
          t.logoUrl = s.logoUrl,
          t.flagUrl = s.flagUrl,
          t.geofence = s.geofence;`)
}
