use NCCRD_ERM;
go

;with projectDetails as (
  select distinct
    p.ProjectDetailsId,
    (select ProvinceName province
     from tb_erm_Province
     join tb_erm_Project_Location_Data ld on ld.ProjectDetailsId = p.ProjectDetailsId
     where ProvinceID = ld.Province for json path
    ) province,
    (select MetroName districtMunicipality
     from tb_erm_Metro_DistrictMunicipality
     join tb_erm_Project_Location_Data ld on ld.ProjectDetailsId = p.ProjectDetailsId
     where MetroID = ld.Metro for json path
    ) districtMunicipality,
    (select LocalMunicipalityName localMunicipality
     from tb_erm_Local_Municipalities
     join tb_erm_Project_Location_Data ld on ld.ProjectDetailsId = p.ProjectDetailsId
     where LocalMunicipalityID = ld.LocalMunicipality for json path
    ) localMunicipality,
    (select TownName cityOrTown
     from tb_erm_Town
     join tb_erm_Project_Location_Data ld on ld.ProjectDetailsId = p.ProjectDetailsId
     where TownID = ld.Town for json path
    ) cityOrTown,
    p.ProjectTitle title,
    p.Description description,
    case TypeOfIntervention
      when 1 then 'Mitigation'
      when 2 then 'Adaptatation'
    end interventionType,
    p.Link link,
    (select AppUserName from tb_erm_appusers where AppUserID = p.ProjectManager) projectManagerEmail,
    concat('2', RIGHT(1000 + p.startYear, 3)) startYear,
    concat('2', RIGHT(1000 + p.endYear, 3)) endYear,
      trim(',' from REPLACE(CONCAT_WS(',', p.LeadAgent, p.HostPartner, p.HostOrganisation), ',,', ',')) implementingOrganization,
    trim(',' from REPLACE(CONCAT_WS(',', p.FundingOrganisation, p.FundingPartner), ',,', ',')) fundingOrganisation,
    (select ItemDisplay from tb_erm_picklist l join tb_erm_picklist_value v on v.ListId = l.ListId where l.ListName = 'Status' and ItemNum = p.Status) implementationStatus,
    replace(CONCAT('R', coalesce(ltrim(str(p.BudgetLower, 25,0)), '0'), ' - R', coalesce(ltrim(str(p.BudgetUpper, 25, 0)), '0')), 'R0 - R0', '') estimatedBudget

  from tb_erm_project_details p
  left join tb_erm_Project_Location_Data ld on ld.ProjectDetailsId = p.ProjectDetailsId
)


,mitigationDetails as (
  select
    ProjectDetailsId,
    (select
      e.Year,
      ltrim(str(e.CO2, 25, 0)) CO2,
      ltrim(str(e.CH4, 25, 0)) CH4,
      ltrim(str(e.CH4_CO2e, 25, 0)) CH4_CO2e,
      ltrim(str(e.N2O, 25, 0)) N2O,
      ltrim(str(e.N2O_CO2e, 25, 0)) N2O_CO2e,
      ltrim(str(e.HFC, 25, 0)) HFC,
      ltrim(str(e.HFC_CO2e, 25, 0)) HFC_CO2e,
      ltrim(str(e.PFC, 25, 0)) PFC,
      ltrim(str(e.PFC_CO2e, 25, 0)) PFC_CO2e,
      ltrim(str(e.SF6, 25, 0)) SF6,
      ltrim(str(e.SF6_CO2e, 25, 0)) SF6_CO2e,
      ltrim(str(e.Hydro, 25, 0)) Hydro,
      ltrim(str(e.Tidal, 25, 0)) Tidal,
      ltrim(str(e.Wind, 25, 0)) Wind,
      ltrim(str(e.Solar, 25, 0)) Solar,
      ltrim(str(e.FossilFuelElecRed, 25, 0)) FossilFuelElecRed,
      ltrim(str(e.BioWaste, 25, 0)) BioWaste,
      ltrim(str(e.BioWaste_CO2e, 25, 0)) BioWaste_CO2e,
      ltrim(str(e.Geothermal, 25, 0)) Geothermal,
      ltrim(str(e.Geothermal_CO2e, 25, 0)) Geothermal_CO2e,
      ltrim(str(e.Hydro_CO2e, 25, 0)) Hydro_CO2e,
      ltrim(str(e.Solar_CO2e, 25, 0)) Solar_CO2e,
      ltrim(str(e.Tidal_CO2e, 25, 0)) Tidal_CO2e,
      ltrim(str(e.Wind_CO2e, 25, 0)) Wind_CO2e,
      ltrim(str(e.FossilFuelElecRed_CO2e, 25, 0)) FossilFuelElecRed_CO2e
     from tb_erm_mitigation_details _m
     join tb_erm_Project_Location_Data ld on ld.ProjectDetailsId = _m.ProjectDetailsId
     join tb_erm_Mitigation_Emissions_Data e on e.ProjectLocationDataId = ld.ProjectLocationDataId
     where _m.ProjectDetailsId = m.ProjectDetailsId
     for json path
    ) _ermDbEmissions,
    (select ItemDisplay from tb_erm_picklist l join tb_erm_picklist_value v on v.ListId = l.ListId where l.ListName = 'Type of Project' and ItemNum = m.ProjectType) mitigationType,
    (select ProjectSubType from tb_erm_Project_SubType where ProjectSubTypeId = m.ProjectSubType) mitigationSubType,
    (select ItemDisplay from tb_erm_picklist l join tb_erm_picklist_value v on v.ListId = l.ListId where l.ListName = 'Host sector' and ItemNum = m.HostSector) hostSector,
    (select MainSubSectorType from tb_erm_Mitigation_MainSubSector where MainSubSectorId = m.HostMainSubSector) hostSubSectorPrimary,
    (select SubSectorType from tb_erm_Mitigation_SubSector where SubSectorId = m.HostSubSector) hostSubSectorSecondary,
    case CarbonCredit
      when 1 then 'Yes'
      when 2 then 'No'
    end carbonCredit,
    case CarbonCreditMarket
      when 1 then 'CDM'
      when 2 then 'Voluntary'
    end carbonCreditStandard,
    case ExecutiveStatus
      when 1 then 'At Validation'
      when 2 then 'Registered'
    end carbonCreditCdmExecutiveStatus,
    (select ItemDisplay from tb_erm_picklist l join tb_erm_picklist_value v on v.ListId = l.ListId where l.ListName = 'CDM Approved Methodology' and ItemNum = m.CDMMethodoloy) carbonCreditCdmMethodology,
    VolMethodoloy carbonCreditVoluntaryMethodology,
    CDMProjectNumber cdmProjectNumber

  from tb_erm_mitigation_details m
)

,adaptationDetails as (
  select
    ProjectDetailsId,
    (select ItemDisplay from tb_erm_picklist l join tb_erm_picklist_value v on v.ListId = l.ListId where l.ListName = 'Adaptation Host Sector' and ItemNum = a.HostSector) adaptationSector,
    (select ItemDisplay from tb_erm_picklist l join tb_erm_picklist_value v on v.ListId = l.ListId where l.ListName = 'Purpose of adaptation' and ItemNum = a.PurposeOfAdaptation) responseImpact

  from tb_erm_Project_Adaptation_Data a
)


,researchDetails as (
  select
    r.ProjectDetailsId,
    (select ItemDisplay from tb_erm_picklist l join tb_erm_picklist_value v on v.ListId = l.ListId where l.ListName = 'Type of research' and ItemNum = r.TypeOfResearch) researchType,
    (select ItemDisplay from tb_erm_picklist l join tb_erm_picklist_value v on v.ListId = l.ListId where l.ListName = 'Target audience' and ItemNum = r.TargetAudience) targetAudience,
    Paper paper
    
  from tb_erm_Project_Research_Data r
)


,submissions as (
  select
    case UpdtUser
      when '' then null
      when 'Admin' then null
      else p.UpdtUser
    end userId,
    case TypeOfProject
      when 1 then 'project'
      when 2 then 'research'
    end submissionType,
    p.VALIDATIONCOMMENTS validationComments,
    (select ItemDisplay from tb_erm_picklist l join tb_erm_picklist_value v on v.ListId = l.ListId where l.ListName = 'DEAT Validation Status' and ItemNum = p.ValidationStatus) validationStatus,
    (select * from projectDetails _p where _p.ProjectDetailsId = p.ProjectDetailsId for json path) project,
    (select * from mitigationDetails _m where _m.ProjectDetailsId = p.ProjectDetailsId for json path) mitigation,
    (select * from adaptationDetails _a where _a.ProjectDetailsId = p.ProjectDetailsId for json path) adaptation,
    (select * from researchDetails _r where _r.ProjectDetailsId = p.ProjectDetailsId for json path) research

  from tb_erm_project_details p
)

select
*
from submissions

(1) GPS coordinates