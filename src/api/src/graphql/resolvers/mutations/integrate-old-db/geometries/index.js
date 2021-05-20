import provinces from './provinces.js'

export default async ctx => {
  const result = {}
  result.provinces = await provinces(ctx)

  return result
}
