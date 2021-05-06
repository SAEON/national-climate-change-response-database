/** User model **/

drop table if exists PermissionRoleXref;
drop table if exists UserRoleXref;
drop table if exists [Permissions];
drop table if exists Roles;
drop table if exists Users;

create table Users (
  id bigint not null identity primary key,
  emailAddress nvarchar(255) not null unique,
  googleId nvarchar(255) unique,
);

create table Roles (
  id bigint not null identity primary key,
  [name] nvarchar(255) not null unique,
  description nvarchar(4000)
);

create table [Permissions] (
  id bigint not null identity primary key,
  [name] nvarchar(255) not null unique,
  description nvarchar(4000)
);

create table PermissionRoleXref (
  id bigint not null identity primary key,
  roleId bigint not null foreign key references Roles (id),
  permissionId bigint not null foreign key references [Permissions] (id),
  unique (roleId, permissionId)
);

create table UserRoleXref (
  id bigint not null identity primary key,
  userId bigint not null foreign key references Users (id),
  roleId bigint not null foreign key references Roles (id),
  unique (userId, roleId)
);

/** Vocabulary trees **/

-- drop table if exists VocabularyXrefVocabulary;
-- drop table if exists VocabularyXrefTree;
-- drop table if exists VocabularyTrees;
-- drop table if exists Vocabulary;

-- create table Vocabulary (
--   id bigint not null identity primary key,
--   term nvarchar(255) not null unique,
--   index ix_vocablulary_terms nonclustered (term)
-- );

-- create table VocabularyTrees (
--   id bigint not null identity primary key,
--   name nvarchar(255) not null unique,
--   description nvarchar(4000),
--   index ix_vocablularyTres_name nonclustered (name)
-- );

-- create table VocabularyXrefTree (
--   id bigint not null identity primary key,
--   vocabularyId bigint not null foreign key references Vocabulary (id),
--   vocabularyTreeId bigint not null foreign key references VocabularyTrees (id),
--   unique (vocabularyId, vocabularyTreeId),
--   index ix_VocabularyXrefTree_vocabularyId nonclustered (vocabularyId),
--   index ix_VocabularyXrefTree_vocabularyTreeId nonclustered (vocabularyTreeId)
-- );

-- create table VocabularyXrefVocabulary (
--   id bigint not null identity primary key,
--   parentId bigint not null foreign key references Vocabulary (id),
--   childId bigint not null foreign key references Vocabulary (id),
--   vocabularyTreeId bigint not null foreign key references VocabularyTrees (id),
--   unique (parentId, childId, vocabularyTreeId),
--   index ix_VocabularyXrefVocabulary_parentId nonclustered (parentId),
--   index ix_VocabularyXrefVocabulary_childId nonclustered (childId),
--   index ix_VocabularyXrefVocabulary_vocabularyTreeId nonclustered (vocabularyTreeId)
-- );