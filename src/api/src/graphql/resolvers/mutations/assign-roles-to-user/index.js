import mssql from 'mssql'

export default async (self, { input }, ctx) => {
  const { pool } = ctx.mssql

  /**
   * Validate that user/tenant combinations
   * in the input array are unique
   */
  input.reduce((acc, { userId, tenantId }) => {
    const key = `${userId}-${tenantId}`
    if (acc[key]) {
      throw new Error(
        'Invalid input - user/tenant combinations per object in the input array must be unique'
      )
    }
    acc[key] = 1
    return acc
  }, {})

  /**
   * The sysadmin role can only be
   * configured at application start
   * time
   **/
  const sysadminId = (
    await (await pool.connect()).request().query(`select id from Roles where name = 'sysadmin'`)
  ).recordset[0].id

  const transaction = new mssql.Transaction(await pool.connect())
  await transaction.begin()

  try {
    for (const i of input) {
      const { userId, tenantId } = i
      const roleIds = i.roleIds.filter(id => id !== sysadminId)

      /**
       * Delete all existing roles
       * of a particular user/tenant
       */
      await transaction
        .request()
        .input('userId', userId)
        .input('sysadminId', sysadminId)
        .input('tenantId', tenantId).query(`
          delete from UserXrefRoleXrefTenant
          where userId = @userId
          and tenantId = @tenantId
          and roleId != @sysadminId;`)

      /**
       * Add roles to user/tenant (if
       * they weren't all deleted)
       */
      if (roleIds.length) {
        const request = transaction.request()
        request.input('userId', userId)
        request.input('tenantId', tenantId)
        roleIds.forEach((id, i) => request.input(`role_${i}`, id))

        await request.query(`
          insert into UserXrefRoleXrefTenant (userId, roleId, tenantId)
          values
            ${roleIds.map((_, i) => `(@userId, @role_${i}, @tenantId)`)};`)
      }
    }

    await transaction.commit()
  } catch (error) {
    console.error('Unable to assign roles to user', error)
    await transaction.rollback()
    throw error
  }

  return (
    await (await pool.connect())
      .request()
      .input('userId', input[0].userId)
      .query(`select * from Users where id = @userId`)
  ).recordset[0]
}
