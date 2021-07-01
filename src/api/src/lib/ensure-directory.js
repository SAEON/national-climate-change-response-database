import { mkdir, access } from 'fs'

export default async directoryPath => {
  directoryPath = directoryPath.replace(/\\/g, '/')

  // -- preparation to allow absolute paths as well
  let root = ''
  if (directoryPath[0] === '/') {
    root = '/'
    directoryPath = directoryPath.slice(1)
  } else if (directoryPath[1] === ':') {
    root = directoryPath.slice(0, 3) // c:\
    directoryPath = directoryPath.slice(3)
  }

  // -- create folders all the way down
  const folders = directoryPath.split('/')
  let folderPath = `${root}`
  for (const folder of folders) {
    folderPath = `${folderPath}${folder}/`

    const folderExists = await new Promise(resolve =>
      access(folderPath, error => {
        if (error) {
          resolve(false)
        }
        resolve(true)
      })
    )

    if (!folderExists) {
      await new Promise((resolve, reject) =>
        mkdir(folderPath, error => {
          if (error) {
            reject(`Error creating ${folderPath}`)
          }
          resolve(folderPath)
        })
      )
    }
  }
}
