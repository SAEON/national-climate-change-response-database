-- Roles
merge Roles t
using (
  select
    'admin' name,
    'System administrator' description
  union
  select
    'dffe' name,
    'Non-privileged user from DFFE' description
  union
  select
    'public' name,
    'Default role for unmanaged users'
) s on s.name = t.name
when not matched then insert (name, description)
  values (
    s.name,
    s.description
  )
when matched then update set
	t.description = s.description;

-- Permissions
merge Permissions t
using (
  select
    'create-project' name,
    null description
  union
  select
    'update-project' name,
    null description
  union
  select
    'delete-project' name,
    null description
  union
  select
    'view-users' name,
    null description
  union
  select
    'view-all-projects' name,
    null description
  union 
  select
    'change-project-owner' name,
    null description
  union    
  select
    'update-users' name,
    null description
) s on s.name = t.name
when not matched then insert (name, description)
  values (
    s.name,
    s.description
  )
when matched then update set
  t.description = s.description;

-- PermissionRoleXref
with xref as (
	select
    R.id roleId,
    P.id permissionId
    from Roles R
    cross join Permissions P
    where R.name = 'admin'
	union
	select
    R.id roleId,
    P.id permissionId
    from Roles R
    join Permissions P on P.name in ('create-project', 'update-project', 'delete-project', 'view-all-projects')
    where R.name = 'dffe'
  union
  select
    R.id roleId,
    P.id permissionId
    from Roles R
    join Permissions P on P.name in ('create-project', 'update-project', 'delete-project')
)
merge PermissionRoleXref t
using (select * from xref) s on s.roleId = t.roleId and s.permissionId = t.permissionId
when not matched then insert (roleId, permissionId)
  values (
    s.roleId,
    s.permissionId
  );