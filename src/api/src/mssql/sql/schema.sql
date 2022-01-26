-- Users
if not exists (
  select *
  from sys.objects
  where
    object_id = OBJECT_ID(N'[dbo].[Users]')
    and type = 'U'
)
begin
create table Users (
  id int not null identity primary key,
  name nvarchar(255) null,
  emailAddress nvarchar(255) not null unique,
  saeonId nvarchar(255) null,
  id_token nvarchar(4000)
);

create unique index users_unique_saeonId on Users(saeonId) where saeonId is not null;
end

-- Roles
if not exists (
  select *
  from sys.objects
  where
    object_id = OBJECT_ID(N'[dbo].[Roles]')
    and type = 'U'
)
begin
create table Roles (
  id int not null identity primary key,
  [name] nvarchar(255) not null unique,
  description nvarchar(4000)
);
end

-- Permissions
if not exists (
  select *
  from sys.objects
  where
    object_id = OBJECT_ID(N'[dbo].[Permissions]')
    and type = 'U'
)
begin
create table Permissions (
  id int not null identity primary key,
  [name] nvarchar(255) not null unique,
  description nvarchar(4000)
);
end

-- PermissionXrefRole
if not exists (
  select *
  from sys.objects
  where
    object_id = OBJECT_ID(N'[dbo].[PermissionXrefRole]')
    and type = 'U'
)
begin
create table PermissionXrefRole (
  id int not null identity primary key,
  roleId int not null foreign key references Roles (id),
  permissionId int not null foreign key references [Permissions] (id),
  unique (roleId, permissionId)
);
end

-- Regions
if not exists (
  select *
  from sys.objects
  where
    object_id = OBJECT_ID(N'[dbo].[Regions]')
    and type = 'U'
)
begin
create table Regions (
  id uniqueidentifier not null primary key default (newsequentialid()),
  properties nvarchar(max),
  code as JSON_VALUE(properties, '$.code'),
  parentCode as JSON_VALUE(properties, '$.parentCode'),
  [name] as JSON_VALUE(properties, '$.name') persisted,
  [geometry] geometry not null,
  [centroid] as [geometry].STCentroid() persisted,
  constraint json_properties check ( isjson(properties) = 1 ),
  index ix_name nonclustered ([name])
);
end

-- Tenants
if not exists (
  select *
  from sys.objects
  where
    object_id = OBJECT_ID(N'[dbo].[Tenants]')
    and type = 'U'
)
begin
create table Tenants (
  id int not null identity primary key,
  isDefault bit default 0,
  hostname nvarchar(255) not null unique,
  title nvarchar(255),
  shortTitle nvarchar(10),
  frontMatter nvarchar(max),
  description nvarchar(2000),
  theme nvarchar(max) not null,
  logoUrl nvarchar(500),
  flagUrl nvarchar(500),
  regionId uniqueidentifier foreign key references Regions (id),
  includeUnboundedSubmissions bit default 0 not null,
  constraint frontMatter_json check ( isjson(frontMatter) = 1 ),
  constraint json_theme check ( isjson(theme) = 1 )
);
end

-- UserXrefRoleXrefTenant
if not exists (
  select *
  from sys.objects
  where
    object_id = OBJECT_ID(N'[dbo].[UserXrefRoleXrefTenant]')
    and type = 'U'
)
begin
create table UserXrefRoleXrefTenant (
  id int not null identity primary key,
  userId int not null foreign key references Users (id),
  roleId int not null foreign key references Roles (id),
  tenantId int not null foreign key references Tenants (id),
  unique (userId, roleId, tenantId)
);
end

-- Vocabulary
if not exists (
  select *
  from sys.objects
  where
    object_id = OBJECT_ID(N'[dbo].[Vocabulary]')
    and type = 'U'
)
begin
create table Vocabulary (
  id int not null identity primary key,
  term nvarchar(850) not null unique,
  properties nvarchar(max),
  description as JSON_VALUE(properties, '$.description'),
  code as JSON_VALUE(properties, '$.code'),
  constraint properties_json check ( isjson(properties) = 1 ),
  index ix_vocablulary_terms nonclustered (term)
);
end

-- Trees
if not exists (
  select *
  from sys.objects
  where
    object_id = OBJECT_ID(N'[dbo].[Trees]')
    and type = 'U'
)
begin
create table Trees (
  id int not null identity primary key,
  name nvarchar(255) not null unique,
  description nvarchar(4000),
  index ix_vocablularyTres_name nonclustered (name)
);
end

-- VocabularyXrefTree
if not exists (
  select *
  from sys.objects
  where
    object_id = OBJECT_ID(N'[dbo].[VocabularyXrefTree]')
    and type = 'U'
)
begin
create table VocabularyXrefTree (
  id int not null identity primary key,
  vocabularyId int not null foreign key references Vocabulary (id),
  treeId int not null foreign key references Trees (id),
  unique (vocabularyId, treeId),
  index ix_VocabularyXrefTree_vocabularyId nonclustered (vocabularyId),
  index ix_VocabularyXrefTree_vocabularyTreeId nonclustered (treeId)
);
end

-- VocabularyXrefVocabulary
if not exists (
  select *
  from sys.objects
  where
    object_id = OBJECT_ID(N'[dbo].[VocabularyXrefVocabulary]')
    and type = 'U'
)
begin
create table VocabularyXrefVocabulary (
  id int not null identity primary key,
  parentId int not null foreign key references Vocabulary (id),
  childId int not null foreign key references Vocabulary (id),
  treeId int not null foreign key references Trees (id),
  unique (childId, treeId),
  index ix_VocabularyXrefVocabulary_parentId nonclustered (parentId),
  index ix_VocabularyXrefVocabulary_childId nonclustered (childId),
  index ix_VocabularyXrefVocabulary_vocabularyTreeId nonclustered (treeId)
);
end

-- VocabularyXrefRegion
if not exists (
  select *
  from sys.objects
  where
    object_id = OBJECT_ID(N'[dbo].[VocabularyXrefRegion]')
    and type = 'U'
)
begin
create table VocabularyXrefRegion (
  id int not null identity primary key,
  vocabularyId int not null foreign key references Vocabulary (id),
  regionId uniqueidentifier not null foreign key references Regions (id),
  unique (vocabularyId, regionId)
);
end

-- ExcelSubmissionTemplates
if not exists (
  select *
  from sys.objects
  where
    object_id = OBJECT_ID(N'[dbo].[ExcelSubmissionTemplates]')
    and type = 'U'
)
begin
create table ExcelSubmissionTemplates (
  id int not null identity primary key,
  createdBy int foreign key references Users (id),
  filePath nvarchar(500) not null unique,
  createdAt datetime2 not null
);
end

-- Submissions
if not exists (
  select *
  from sys.objects
  where
    object_id = OBJECT_ID(N'[dbo].[Submissions]')
    and type = 'U'
)
begin
create table Submissions (
  _id int not null unique identity,
  id uniqueidentifier not null primary key default (newsequentialid()),
  submissionStatus nvarchar(4000),
  submissionComments nvarchar(max),
  submissionType nvarchar(255),
  project nvarchar(max),
  mitigation nvarchar(max),
  adaptation nvarchar(max),
  research nvarchar(max),
  isSubmitted bit default 0,
  userId int foreign key references Users (id),
  createdBy int foreign key references Users (id),
  createdAt datetime2 not null,
  deletedAt datetime2 null,
  _projectTitle as JSON_VALUE(project, '$.title'),
  _projectDescription as JSON_VALUE(project, '$.description'),
  index ix_submissions nonclustered (id),
  constraint json_research check( isjson(research) = 1),
  constraint json_submissionStatus check( isjson(submissionStatus) = 1),
  constraint json_project check( isjson(project) = 1),
  constraint json_mitigation check( isjson(mitigation) = 1),
  constraint json_Adaptation check( isjson(adaptation) = 1)
);
end

-- https://schwabencode.com/blog/2019/10/27/MSSQL-Server-2017-Docker-Full-Text-Search

-- create fulltext catalogue submissionDetails;
-- create fulltext index on Submissions(
--   _projectTitle language 1033,
--   _projectDescription language 1033
-- ) key index ix_submissions_id on Submissions;

-- WebSubmissionFiles
if not exists (
  select *
  from sys.objects
  where
    object_id = OBJECT_ID(N'[dbo].[WebSubmissionFiles]')
    and type = 'U'
)
begin
create table WebSubmissionFiles (
  id int not null identity primary key,
  name nvarchar(255) not null,
  filePath nvarchar(500) not null unique,
  webSubmissionId uniqueidentifier not null foreign key references Submissions (id),
  createdBy int foreign key references Users (id),
  createdAt datetime2 not null
);
end

-- TenantXrefSubmission
if not exists (
  select *
  from sys.objects
  where
    object_id = OBJECT_ID(N'[dbo].[TenantXrefSubmission]')
    and type = 'U'
)
begin
create table TenantXrefSubmission (
  id int not null identity primary key,
  tenantId int not null foreign key references Tenants (id),
  submissionId uniqueidentifier not null foreign key references Submissions (id),
  index ix_TenantXrefSubmission_tenantId_submissionId unique nonclustered (tenantId, submissionId),
);
end


/**
 * FUNCTIONS
 */

-- ESTIMATE_SPEND
if not exists (
  select *
  from sys.objects
  where
    object_id = OBJECT_ID(N'[dbo].[ESTIMATE_SPEND]')
    and type = 'FN'
)
begin
DECLARE @sql NVARCHAR(MAX);
SET @sql = N'create function [dbo].[ESTIMATE_SPEND] ( @estimatedBudget nvarchar(500) ) returns bigint as begin declare @result bigint ;with cte as ( select cast( replace(replace(replace(trim(value), ''R'', ''''), ''m'', ''000000''), ''k'', ''000'') as bigint ) val from string_split(@estimatedBudget, ''-'') ) select @result = avg(val) from cte return @result end';
EXEC sp_executesql @sql;
end

