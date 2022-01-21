import getCurrentDirectory from '../../../../lib/get-current-directory.js'
import { readdir, lstat } from 'fs'
import { join, normalize, sep } from 'path'

const __dirname = getCurrentDirectory(import.meta)

const migrations = new Promise((resolve, reject) => {
  const path = normalize(join(__dirname, `.${sep}migrations`))
  readdir(path, (error, entries) => {
    if (error) {
      reject(error)
    } else {
      resolve(
        entries.reduce(async (index, name) => {
          index = await index
          const _path = normalize(join(path, `.${sep}${name}`))
          const isDirectory = await new Promise((y, x) =>
            lstat(_path, (error, stats) => (error ? x() : stats.isDirectory() ? y(true) : y(false)))
          )

          if (isDirectory) {
            index[name.replaceAll('-', '_').toUpperCase()] = normalize(
              join(_path, `.${sep}index.js`)
            )
          }

          return Promise.resolve(index)
        }, Promise.resolve({}))
      )
    }
  })
})

export default async (self, { migration: key }, ctx) => {
  console.info('Running DB migration', key)

  const index = await migrations
  const migration = index[key]
  const fn = await import(migration).then(({ default: fn }) => fn)

  try {
    const result = await fn(ctx)
    if (result === true || result === undefined) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.error('Error running DB migration', key, error)
    throw error
  }
}
