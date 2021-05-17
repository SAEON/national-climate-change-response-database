import finder from '../../../lib/find-vocabulary-helper.js'

export default {
  mitigationType: async ({ mitigationTypeId }, _, ctx) => finder(ctx, mitigationTypeId),
  mitigationSubType: async ({ mitigationSubTypeId }, _, ctx) => finder(ctx, mitigationSubTypeId),
  interventionStatus: async ({ interventionStatusId }, _, ctx) => finder(ctx, interventionStatusId),
  cdmMethodology: async ({ cdmMethodologyId }, _, ctx) => finder(ctx, cdmMethodologyId),
  cdmExecutiveStatus: async ({ cdmExecutiveStatusId }, _, ctx) => finder(ctx, cdmExecutiveStatusId),
  hostSector: async ({ hostSectorId }, _, ctx) => finder(ctx, hostSectorId),
  hostSubSectorPrimary: async ({ hostSubSectorPrimaryId }, _, ctx) =>
    finder(ctx, hostSubSectorPrimaryId),
  hostSubSectorSecondary: async ({ hostSubSectorSecondaryId }, _, ctx) =>
    finder(ctx, hostSubSectorSecondaryId),
}
