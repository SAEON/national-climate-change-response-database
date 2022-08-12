import * as charts from './chart-types/index.js'

export default async (self, { id }, ...props) => {
  const fn = charts[id]

  try {
    return { id, data: await fn(...props) }
  } catch (error) {
    console.error('Error creating chart', id, error.message)
    throw error
  }
}
