/** User model **/

-- Roles
insert into Roles (name, description)
values
  ('admin', 'System administrator'),
  ('dffe', 'Non-privileged user from DFFE');

-- Permissions
insert into [Permissions] (name, description)
values
  ('create-project', ''),
  ('update-project', ''),
  ('delete-project', ''),
  ('view-users', ''),
  ('update-users', '');

-- PermissionRoleXref
with xref as (
	select
    R.id roleId,
    P.id permissionId
    from Roles R
    cross join [Permissions] P
    where R.name = 'admin'
	union
	select
    R.id roleId,
    P.id permissionId
    from Roles R
    join [Permissions] P on P.name in ('create-project', 'update-project', 'delete-project')
    where R.name = 'dffe'
)
insert into PermissionRoleXref (roleId, permissionId)
select * from xref; 