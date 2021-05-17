import finder from '../../../lib/find-vocabulary-helper.js'

export default {
  adaptationSector: async ({ adaptationSectorId }, _, ctx) => finder(ctx, adaptationSectorId),
  adaptationPurpose: async ({ adaptationPurposeId }, _, ctx) => finder(ctx, adaptationPurposeId),
  hazardFamily: async ({ hazardFamilyId }, _, ctx) => finder(ctx, hazardFamilyId),
  hazardSubFamily: async ({ hazardSubFamilyId }, _, ctx) => finder(ctx, hazardSubFamilyId),
  hazard: async ({ hazardId }, _, ctx) => finder(ctx, hazardId),
  subHazard: async ({ subHazardId }, _, ctx) => finder(ctx, subHazardId),
}
