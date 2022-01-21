import permissions from './permissions.js'
import _deduplicate from '../lib/deduplicate-obj.js'

const deduplicate = arr => _deduplicate(arr, (p1, p2) => p1.name === p2.name)

export const user = {
  name: 'user',
  description: 'Default login role (unmanaged users)',
  permissions: deduplicate([
    permissions['attach-file-to-submission'],
    permissions['create-submission'],
    permissions['download-submission'],
  ]),
}

export const maintainer = {
  name: 'maintainer',
  description: 'Validate and update submissions, and general application maintenance',
  permissions: deduplicate([
    ...user.permissions,
    permissions['update-submission'],
    permissions['validate-submission'],
  ]),
}

export const tenantAdmin = {
  name: 'tenant-admin',
  description: 'Tenant administrator',
  permissions: deduplicate([
    ...maintainer.permissions,
    permissions['view-submission-templates'],
    permissions['delete-submission'],
    permissions['view-users'],
    permissions['update-users'],
    permissions['assign-role'],
    permissions['assign-permission'],
    permissions['view-permissions'],
    permissions['view-roles'],
    permissions['/access'],
  ]),
}

export const admin = {
  name: 'admin',
  description: 'Deployment administrator',
  permissions: deduplicate([
    ...tenantAdmin.permissions,
    permissions['upload-template'],
    permissions['/deployment'],
    permissions['create-tenant'],
    permissions['view-tenants'],
    permissions['update-tenant'],
    permissions['delete-tenant'],
  ]),
}

export const sysadmin = {
  name: 'sysadmin',
  description: 'System administrators',
  permissions: deduplicate([
    ...admin.permissions,
    permissions['migrate-database'],
    permissions['seed-database'],
  ]),
}
