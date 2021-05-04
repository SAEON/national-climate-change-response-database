/** User model **/

drop table if exists PermissionRoleXref;
drop table if exists UserRoleXref;
drop table if exists [Permissions];
drop table if exists Roles;
drop table if exists Users;

create table Users (
  id int not null identity(1,1) primary key,
  emailAddress nvarchar(255) not null unique,
  googleId nvarchar(255) unique,
);

create table Roles (
  id int not null identity(1,1) primary key,
  [name] nvarchar(255) not null unique,
  description nvarchar(4000)
);

create table [Permissions] (
  id int not null identity(1,1) primary key,
  [name] nvarchar(255) not null unique,
  description nvarchar(4000)
);

create table PermissionRoleXref (
  id int not null identity(1,1) primary key,
  roleId int not null foreign key references Roles (id),
  permissionId int not null foreign key references [Permissions] (id),
  unique (roleId, permissionId)
);

create table UserRoleXref (
  id int not null identity(1,1) primary key,
  userId int not null foreign key references Users (id),
  roleId int not null foreign key references Roles (id),
  unique (userId, roleId)
)