import DataLoader from 'dataloader'
import { pool } from '../pool.js'
import sift from 'sift'

export default () =>
  new DataLoader(
    async keys => {
      const _pool = await pool.connect()
      const request = _pool.request()
      keys.forEach((key, i) => request.input(`key_${i}`, key))

      const result = await request.query(`
        select
          x.userId,
          ( select
              roleId
            from UserXrefRoleXrefTenant x2
            where
              x2.tenantId = x.tenantId
              and x2.userId = x.userId
            for json path ) roles,
          ( select
              *
            from Tenants t
            where
              t.id = x.tenantId
            for json path ) tenants
        from (
          select distinct
            userId,
            tenantId
          from UserXrefRoleXrefTenant
        ) x
        where
          x.userId in (${keys.map((_, i) => `@key_${i}`)});`)

      return keys.map(userId =>
        result.recordset
          .filter(sift({ userId }))
          .map(({ tenants, roles, ..._fields }) =>
            JSON.parse(tenants).map(({ ...fields }) => ({
              ...fields,
              ['..']: { roles: JSON.parse(roles).map(({ roleId }) => roleId), ..._fields },
            }))
          )
          .flat()
      )
    },
    {
      batch: true,
      maxBatchSize: 250,
      cache: true,
    }
  )
