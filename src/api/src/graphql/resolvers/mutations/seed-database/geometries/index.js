import provinces from './_provinces.js'
import districtMunicipalities from './_district-municipalities.js'
import localMunicipalities from './_local-municipalities.js'

export default async ctx => ({
  provinces: await provinces(ctx),
  districtMunicipalities: await districtMunicipalities(ctx),
  localMunicipalities: await localMunicipalities(ctx),
})
