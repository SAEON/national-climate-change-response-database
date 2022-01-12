import { pool } from '../pool.js'
import getCurrentDirectory from '../../lib/get-current-directory.js'
import { performance } from 'perf_hooks'
import { join, normalize, sep } from 'path'
import mssql from 'mssql'
import insertRegion from './_insert-region-query.js'

const __dirname = getCurrentDirectory(import.meta)

const load = async (f, dir = `.${sep}geojson`) => {
  const path = normalize(join(__dirname, dir, f))
  return await import(path, { assert: { type: 'json' } }).then(({ default: json }) => json)
}

/**
 * South Africa
 *  (1) Country boundary
 *  (2) Provincial boundaries
 *  (3) District municipalities
 *  (4) Local municipalities
 *
 * GeoJSON files are NOT imported statically
 * since they can be very large and would
 * increase the memory footprint of the app
 */
export default async () => {
  const t0 = performance.now()

  /**
   * In a single transaction
   *  - Load all Regions
   *  - Associate regions vocab with regional polygons
   */
  const transaction = new mssql.Transaction(await pool.connect())
  await transaction.begin()

  try {
    const { count } = await (
      await transaction.request().query(`select count(id) count from Regions;`)
    ).recordset[0]

    /**
     * Install Regions
     */
    if (count < 1) {
      // SA
      const za = await load('za-boundary.geojson')
      const { properties, geometry } = za.features[0]
      await insertRegion(transaction, { properties, geometry })
      console.info('Loaded ZA geometry')

      // SA provinces
      const provinces = (await load('za-provinces.geojson')).features
      for (const feature of provinces) {
        const properties = {
          ...feature.properties,
          code: feature.properties.ADM1_ID,
          name: feature.properties.ADM1_EN,
          parentCode: 'ZA',
        }
        await insertRegion(transaction, {
          properties,
          geometry: feature.geometry,
        })
      }
      console.info('Loaded provinces geometry')

      // SA district municipalities & metropolitan municipalities
      const districts = (await load('za-district-municipalities.geojson')).features
      for (const feature of districts) {
        const properties = {
          ...feature.properties,
          code: feature.properties.DISTRICT,
          name: feature.properties.DISTRICT_N,
          parentCode: feature.properties.PROVINCE,
        }
        await insertRegion(transaction, {
          properties,
          geometry: feature.geometry,
        })
      }
      console.info('Loaded district municipality geometry')

      // SA local municipalities (including local municipalities that are also metropolitan municipalities)
      const regions = (await load('za-local-municipalities.geojson')).features
      for (const feature of regions) {
        const properties = {
          ...feature.properties,
          code: feature.properties.CAT_B,
          name: feature.properties.MUNICNAME,
          parentCode: feature.properties.DISTRICT,
        }
        await insertRegion(transaction, {
          properties,
          geometry: feature.geometry,
        })
      }
      console.info('Loaded local municipality geometry')
    } else {
      console.info('Skipping geometry installing (already installed)')
    }

    await transaction.commit()

    const t1 = performance.now()
    const runtime = `${Math.round((t1 - t0) / 1000, 2)} seconds`
    console.info('Regions loaded!', runtime)
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}
