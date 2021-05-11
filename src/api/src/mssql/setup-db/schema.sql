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
  id bigint not null identity primary key,
  emailAddress nvarchar(255) not null unique,
  googleId nvarchar(255) unique,
);
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
  id bigint not null identity primary key,
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
  id bigint not null identity primary key,
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
  id bigint not null identity primary key,
  roleId bigint not null foreign key references Roles (id),
  permissionId bigint not null foreign key references [Permissions] (id),
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
  id bigint not null identity primary key,
  userId bigint not null foreign key references Users (id),
  roleId bigint not null foreign key references Roles (id),
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
  id bigint not null identity primary key,
  term nvarchar(255) not null unique,
  description nvarchar(4000) null,
  index ix_vocablulary_terms nonclustered (term)
);
end

-- VocabularyTrees
if not exists (
	select *
	from sys.objects
	where
		object_id = OBJECT_ID(N'[dbo].[VocabularyTrees]')
		and type = 'U'
)
begin
create table VocabularyTrees (
  id bigint not null identity primary key,
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
  id bigint not null identity primary key,
  vocabularyId bigint not null foreign key references Vocabulary (id),
  vocabularyTreeId bigint not null foreign key references VocabularyTrees (id),
  unique (vocabularyId, vocabularyTreeId),
  index ix_VocabularyXrefTree_vocabularyId nonclustered (vocabularyId),
  index ix_VocabularyXrefTree_vocabularyTreeId nonclustered (vocabularyTreeId)
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
  id bigint not null identity primary key,
  parentId bigint not null foreign key references Vocabulary (id),
  childId bigint not null foreign key references Vocabulary (id),
	-- TODO order
  vocabularyTreeId bigint not null foreign key references VocabularyTrees (id),
  unique (parentId, childId, vocabularyTreeId),
  index ix_VocabularyXrefVocabulary_parentId nonclustered (parentId),
  index ix_VocabularyXrefVocabulary_childId nonclustered (childId),
  index ix_VocabularyXrefVocabulary_vocabularyTreeId nonclustered (vocabularyTreeId)
);
end

-- Projects
if not exists (
	select *
	from sys.objects
	where
		object_id = OBJECT_ID(N'[dbo].[Projects]')
		and type = 'U'
)
begin
create table Projects (
  id bigint not null identity primary key,
  title nvarchar(255) not null unique,
  description nvarchar(4000),
	projectManager nvarchar(255),
	link nvarchar(255),
	startDate date,
	endDate date,
	validationComments nvarchar(4000),
	fundingOrganisation nvarchar(255),
	fundingPartner nvarchar(255),
	budgetLower money,
	budgetUpper money,
	hostOrganisation nvarchar(255),
	hostPartner nvarchar(255),
	alternativeContact nvarchar(255),
	alternativeContactEmail nvarchar(255),
	leadAgent nvarchar(255),
	interventionTypeId bigint foreign key references VocabularyXrefVocabulary (id),
	projectStatusId bigint foreign key references VocabularyXrefVocabulary (id),
	validationStatusId bigint foreign key references VocabularyXrefVocabulary (id),	
	fundingStatusId bigint foreign key references VocabularyXrefVocabulary (id),	
	estimatedBudgetId bigint foreign key references VocabularyXrefVocabulary (id),	
	hostSectorId bigint foreign key references VocabularyXrefVocabulary (id),
	hostSubSectorId bigint foreign key references VocabularyXrefVocabulary (id)
);
end