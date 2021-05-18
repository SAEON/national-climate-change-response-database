import pool from '../../../../mssql/pool.js'

const query = pool({ database: 'VMS' })

export default async (_, args, ctx) => {
  const r = await query('select * from provinces', (error, row) => {
    if (error) {
      console.error('Error!', error.message)
    }

    console.log('hi')
  })

  console.log(r)

  return {
    test: true,
  }
}
