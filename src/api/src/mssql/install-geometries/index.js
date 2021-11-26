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
  const za = await load('za-boundary.json')
  const { properties, geometry } = za.features[0]
  await query(transaction, { properties, geometry })

  /**
   * Provinces
   */
  // TODO

  /**
   * Districts
   */
  const districts = (await load('za-district-municipalities.json')).features
  for (const feature of districts) {
    const { properties, geometry } = feature
    await query(transaction, { properties, geometry })
  }

  /**
   * Local municipalities
   */
  const municipalities = (await load('za-local-municipalities.json')).features
  for (const feature of municipalities) {
    const { properties, geometry } = feature
    // await query(transaction, { properties, geometry }) // TODO - wait for CODE
  }

  await transaction.commit()

  const t1 = performance.now()
  const runtime = `${Math.round((t1 - t0) / 1000, 2)} seconds`
  console.info('Geometries loaded!', runtime)
}
