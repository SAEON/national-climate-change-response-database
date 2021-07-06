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
	familyName nvarchar(255) null,
  emailAddress nvarchar(255) not null unique,
  googleId nvarchar(255) null,
	saeonId nvarchar(255) null
);

create unique index users_unique_googleId on Users(googleId) where googleId is not null;
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

-- PermissionRoleXref
if not exists (
	select *
	from sys.objects
	where
		object_id = OBJECT_ID(N'[dbo].[PermissionRoleXref]')
		and type = 'U'
)
begin
create table PermissionRoleXref (
  id int not null identity primary key,
  roleId int not null foreign key references Roles (id),
  permissionId int not null foreign key references [Permissions] (id),
  unique (roleId, permissionId)
);
end

-- UserRoleXref
if not exists (
	select *
	from sys.objects
	where
		object_id = OBJECT_ID(N'[dbo].[UserRoleXref]')
		and type = 'U'
)
begin
create table UserRoleXref (
  id int not null identity primary key,
  userId int not null foreign key references Users (id),
  roleId int not null foreign key references Roles (id),
  unique (userId, roleId)
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
  description nvarchar(4000) null,
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

-- Geometries
if not exists (
	select *
	from sys.objects
	where
		object_id = OBJECT_ID(N'[dbo].[Geometries]')
		and type = 'U'
)
begin
create table Geometries (
  id int not null identity primary key,
	name nvarchar(255) not null unique,
	shortname nvarchar(10) null,
	description nvarchar(4000),
	[geometry] geometry not null,
	[geometry_simplified] geometry null
);

create unique index Geometries_unique_shortname on Geometries(shortname) where shortname is not null;
end

-- GeometryXrefVocabularyTreeX
if not exists (
	select *
	from sys.objects
	where
		object_id = OBJECT_ID(N'[dbo].[GeometryXrefVocabularyTreeX]')
		and type = 'U'
)
begin
create table GeometryXrefVocabularyTreeX (
  id int not null identity primary key,
	vocabularyXrefTreeId int not null foreign key references VocabularyXrefTree (id),
	geometryId int not null foreign key references Geometries (id),
	unique (vocabularyXrefTreeId, geometryId)
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
  id uniqueidentifier not null primary key default (newsequentialid()),
	validationStatus nvarchar(4000),
	validationComments nvarchar(max),
	project nvarchar(max),
	mitigation nvarchar(max),
	adaptation nvarchar(max),
	isSubmitted bit default 0,
	createdBy int foreign key references Users (id),
	createdAt datetime2 not null,
	deletedAt datetime2 null,
	index ix_submissions nonclustered (id),
	constraint json_validationStatus check(isjson(validationStatus)=1),
	constraint json_project check(isjson(project)=1),
	constraint json_mitigation check(isjson(mitigation)=1),
	constraint json_Adaptation check(isjson(adaptation)=1)
);
end

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