import packageJson from '../../package.json'
export default async ctx => {
  ctx.body = `${packageJson.name}, v${packageJson.version}`
}
