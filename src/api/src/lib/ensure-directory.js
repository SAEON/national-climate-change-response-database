import { existsSync, mkdirSync } from 'fs'

export default directoryPath => {
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
  folders.reduce(
    (acc, folder) => {
      const folderPath = acc + folder + '/'
      if (!existsSync(folderPath)) {
        mkdirSync(folderPath)
      }
      return folderPath
    },
    root // first 'acc', important
  )
}
