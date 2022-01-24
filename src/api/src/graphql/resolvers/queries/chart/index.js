import getCurrentDirectory from '../../../../lib/get-current-directory.js'
import { readdir, lstat } from 'fs'
import { join, normalize, sep } from 'path'

const __dirname = getCurrentDirectory(import.meta)

const charts = new Promise((resolve, reject) => {
  const path = normalize(join(__dirname, `.${sep}chart-types`))
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

export default async (self, { id }, ...props) => {
  const index = await charts
  const fn = await import(index[id]).then(({ default: fn }) => fn)

  try {
    return { id, data: await fn(...props) }
  } catch (error) {
    console.error('Error creating chart', id, error.message)
    throw error
  }
}
