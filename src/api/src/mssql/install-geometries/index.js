import { pool } from '../pool.js'
import getCurrentDirectory from '../../lib/get-current-directory.js'
import { performance } from 'perf_hooks'
import { join } from 'path'
import mssql from 'mssql'
import query from './_query.js'

const __dirname = getCurrentDirectory(import.meta)

const load = async f =>
  await import(join(__dirname, './geojson/', f)).then(({ default: json }) => json)

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
   * All geometries are loaded in a single transaction
   */
  const transaction = new mssql.Transaction(await pool.connect())
  await transaction.begin()

  /**
   * South Africa
   */
  const za = await load('za-boundary.geojson')
  const { properties, geometry } = za.features[0]
  await query(transaction, { properties, geometry })
  console.info('Loaded ZAR geometry')

  /**
   * Provinces
   */
  const provinces = (await load('za-provinces.geojson')).features
  for (const feature of provinces) {
    const properties = {
      ...feature.properties,
      code: feature.properties.ADM1_ID,
      name: feature.properties.ADM1_EN,
      parentCode: 'ZA',
    }
    await query(transaction, {
      properties,
      geometry: feature.geometry,
    })
  }
  console.info('Loaded provinces geometry')

  /**
   * Districts
   */
  const districts = (await load('za-district-municipalities.geojson')).features
  for (const feature of districts) {
    const properties = {
      ...feature.properties,
      code: feature.properties.DISTRICT,
      name: feature.properties.DISTRICT_N,
      parentCode: feature.properties.PROVINCE,
    }
    await query(transaction, {
      properties,
      geometry: feature.geometry,
    })
  }
  console.info('Loaded district municipality geometry')

  /**
   * Local municipalities
   */
  const regions = (await load('za-local-municipalities.geojson')).features
  for (const feature of regions) {
    const properties = {
      ...feature.properties,
      code: feature.properties.CAT_B,
      name: feature.properties.MUNICNAME,
      parentCode: feature.properties.DISTRICT,
    }
    await query(transaction, {
      properties,
      geometry: feature.geometry,
    })
  }
  console.info('Loaded local municipality geometry')

  await transaction.commit()

  const t1 = performance.now()
  const runtime = `${Math.round((t1 - t0) / 1000, 2)} seconds`
  console.info('Geometries loaded!', runtime)
}
