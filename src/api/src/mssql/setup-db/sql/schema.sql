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
  emailAddress nvarchar(255) not null unique,
  googleId nvarchar(255) unique,
	saeonId nvarchar(255) unique
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
  vocabularyTreeId int not null foreign key references VocabularyTrees (id),
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
  id int not null identity primary key,
  parentId int not null foreign key references Vocabulary (id),
  childId int not null foreign key references Vocabulary (id),
	-- TODO order
  vocabularyTreeId int not null foreign key references VocabularyTrees (id),
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
  id int not null identity primary key,
  title nvarchar(255),
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
	interventionType int foreign key references VocabularyXrefTree (id),
	projectStatus int foreign key references VocabularyXrefTree (id),
	validationStatus int foreign key references VocabularyXrefTree (id),	
	fundingStatus int foreign key references VocabularyXrefTree (id),	
	estimatedBudget int foreign key references VocabularyXrefTree (id),	
	hostSector int foreign key references VocabularyXrefTree (id),
	hostSubSector int foreign key references VocabularyXrefTree (id)
);
end

-- Mitigations
if not exists (
	select *
	from sys.objects
	where
		object_id = OBJECT_ID(N'[dbo].[Mitigations]')
		and type = 'U'
)
begin
create table Mitigations (
  id int not null identity primary key,
	projectId int not null foreign key references Projects (id),
	title nvarchar(255),
	description nvarchar(4000),
	carbonCredit bit,
	volMethodology nvarchar(255),
	goldStandard bit,
	vcs bit,
	otherCarbonCreditStandard bit,
	otherCarbonCreditStandardDescription nvarchar(4000),
	cdmProjectNumber nvarchar(255),
	cdmStatus nvarchar(255),
	isResearch bit default 0,
  researchDescription nvarchar(4000),
  researchType nvarchar(255),
  researchTargetAudience nvarchar(255),
  researchAuthor nvarchar(255),
  researchPaper nvarchar(255),	
	mitigationType int foreign key references VocabularyXrefTree (id),
	mitigationSubType int foreign key references VocabularyXrefTree (id),
	interventionStatus int foreign key references VocabularyXrefTree (id),
	cdmMethodology int foreign key references VocabularyXrefTree (id),
	cdmExecutiveStatus int foreign key references VocabularyXrefTree (id),
	hostSector int foreign key references VocabularyXrefTree (id),
	hostSubSectorPrimary int foreign key references VocabularyXrefTree (id),
	hostSubSectorSecondary int foreign key references VocabularyXrefTree (id)
);
end

-- Adaptations
if not exists (
	select *
	from sys.objects
	where
		object_id = OBJECT_ID(N'[dbo].[Adaptations]')
		and type = 'U'
)
begin
create table Adaptations (
  id int not null identity primary key,
	projectId int not null foreign key references Projects (id),
  title nvarchar(255),
  description nvarchar(255),
  startDate date,
  endDate date,
	xy nvarchar(4000),
	isResearch bit default 0,
  researchDescription nvarchar(4000),
  researchType nvarchar(255),
  researchTargetAudience nvarchar(255),
  researchAuthor nvarchar(255),
  researchPaper nvarchar(255),
  adaptationSector int foreign key references VocabularyXrefTree (id),
  adaptationPurpose int foreign key references VocabularyXrefTree (id),
  hazardFamily int foreign key references VocabularyXrefTree (id),
  hazardSubFamily int foreign key references VocabularyXrefTree (id),
  hazard int foreign key references VocabularyXrefTree (id),
  subHazard int foreign key references VocabularyXrefTree (id),
	province int foreign key references VocabularyXrefTree (id),
	districtMunicipality int foreign key references VocabularyXrefTree (id),
	localMunicipality int foreign key references VocabularyXrefTree (id)
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
	shortname nvarchar(10) null unique,
	description nvarchar(4000),
	[geometry] geometry not null,
	[geometry_simplified] geometry null
);
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