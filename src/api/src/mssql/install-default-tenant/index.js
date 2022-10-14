import theme from './default-theme.js'
import frontMatter from './front-matter.js'
import { pool } from '../pool.js'
import mssql from 'mssql'
import { HOSTNAME, DEFAULT_SHORTNAME } from '../../config/index.js'

export default async () => {
  const transaction = new mssql.Transaction(await pool.connect())
  await transaction.begin()

  const hostname = new URL(HOSTNAME).hostname

  try {
    /**
     * Set isDefault to 0 for all tenants that don't
     * match the current hostname (this probably means
     * the database has been moved to a new host)
     */
    await transaction.request().input('hostname', hostname).query(`
     update Tenants
     set isDefault = 0
     where hostname != @hostname`)

    /**
     * Then make sure that a default tenant exists for the current
     * deployed hostname
     */
    await transaction
      .request()
      .input('hostname', hostname)
      .input('title', 'National Climate Change Response Database')
      .input('shortTitle', DEFAULT_SHORTNAME)
      .input('description', 'National Climate Change Response Database')
      .input('logoUrl', 'http/public-image/dffe-logo.jpg')
      .input('frontMatter', JSON.stringify(frontMatter))
      .input('flagUrl', 'http/public-image/sa-flag.jpg')
      .input('includeUnboundedSubmissions', 1)
      .input('contactEmailAddress', '')
      .input('theme', JSON.stringify(theme)).query(`
        merge Tenants t
        using (
          select
            1 isDefault,
            @hostname hostname,
            @title title,
            @shortTitle shortTitle,
            @frontMatter frontMatter,
            @description description,
            @theme theme,
            @logoUrl logoUrl,
            @flagUrl flagUrl,
            ( select id from Regions where code = 'ZA') regionId,
            @includeUnboundedSubmissions includeUnboundedSubmissions,
            @contactEmailAddress contactEmailAddress
        ) s on s.hostname = t.hostname
        
        when not matched
          then insert (
            hostname,
            isDefault,
            title,
            shortTitle,
            frontMatter,
            description,
            theme,
            logoUrl,
            flagUrl,
            regionId,
            includeUnboundedSubmissions,
            contactEmailAddress
          ) values (
            s.hostname,
            s.isDefault,
            s.title,
            s.shortTitle,
            s.frontMatter,
            s.description,
            s.theme,
            s.logoUrl,
            s.flagUrl,
            s.regionId,
            s.includeUnboundedSubmissions,
            s.contactEmailAddress
          )

        when matched
          then update set
            t.isDefault = s.isDefault,
            t.title = s.title,
            t.shortTitle = s.shortTitle,
            t.frontMatter = s.frontMatter,
            t.description = s.description,
            t.theme = s.theme,
            t.logoUrl = s.logoUrl,
            t.flagUrl = s.flagUrl,
            t.regionId = s.regionId,
            t.includeUnboundedSubmissions = s.includeUnboundedSubmissions
            
        output
            $action,
            inserted.id;`)

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}
