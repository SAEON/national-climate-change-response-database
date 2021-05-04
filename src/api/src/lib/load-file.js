import { readFile } from 'fs'

export default p =>
  new Promise((resolve, reject) => {
    readFile(p, (error, data) => {
      if (error) {
        reject(error)
      } else {
        resolve(data.toString('utf8'))
      }
    })
  })
