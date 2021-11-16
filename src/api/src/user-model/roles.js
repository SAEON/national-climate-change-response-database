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
    permissions['download-all-submissions'],
  ]),
}

export const dffe = {
  name: 'dffe',
  description: 'Non-privileged user from DFFE',
  permissions: deduplicate([
    ...user.permissions,
    permissions['update-submission'],
    permissions['validate-submission'],
  ]),
}

export const admin = {
  name: 'admin',
  description: 'Application administrator',
  permissions: deduplicate([
    ...dffe.permissions,
    permissions['upload-template'],
    permissions['view-submission-templates'],
    permissions['delete-submission'],
    permissions['update-users'],
    permissions['view-users'],
    permissions['assign-role'],
    permissions['assign-permission'],
    permissions['view-permissions'],
    permissions['view-roles'],
    permissions['/access'],
    permissions['/deployments'],
    permissions['create-tenant'],
  ]),
}

export const sysadmin = {
  name: 'sysadmin',
  description: 'System administrators',
  permissions: deduplicate([...admin.permissions, permissions['seed-database']]),
}

export default [user, dffe, admin, sysadmin]
