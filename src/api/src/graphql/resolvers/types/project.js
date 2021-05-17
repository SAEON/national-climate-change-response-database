import finder from '../../../lib/find-vocabulary-helper.js'

export default {
  interventionType: async ({ interventionTypeId }, _, ctx) => {
    return await finder(ctx, interventionTypeId)
  },
  projectStatus: async ({ projectStatusId }, _, ctx) => {
    return await finder(ctx, projectStatusId)
  },
  validationStatus: async ({ validationStatusId }, _, ctx) => {
    return await finder(ctx, validationStatusId)
  },
  fundingStatus: async ({ fundingStatusId }, _, ctx) => {
    return await finder(ctx, fundingStatusId)
  },
  estimatedBudget: async ({ estimatedBudgetId }, _, ctx) => {
    return await finder(ctx, estimatedBudgetId)
  },
  hostSector: async ({ hostSectorId }, _, ctx) => {
    return await finder(ctx, hostSectorId)
  },
  hostSubSector: async ({ hostSubSectorId }, _, ctx) => {
    return await finder(ctx, hostSubSectorId)
  },
}
