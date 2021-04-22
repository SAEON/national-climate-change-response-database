import { readdirSync, lstatSync, existsSync } from 'fs'
import { execSync, exec as e } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join, normalize } from 'path'

const NPM_NATIVE_SCRIPTS = ['install']

export const NPM_SCRIPTS = Object.freeze({
  install: 'install',
  ncu: 'ncu',
})

export const getDirname = url => dirname(fileURLToPath(url))

export const exec = (CMD, debug = false) =>
  debug ? console.log(CMD) : execSync(CMD, { stdio: [0, 1, 2] })

export const execWithOutput = CMD =>
  new Promise((resolve, reject) => {
    let data = ''
    let error = ''
    const p = e(CMD)
    p.stdout.on('data', chunk => (data += chunk.toString('utf8')))
    p.stdout.on('end', () => resolve(data))
    p.stderr.on('data', chunk => (error += chunk.toString('utf8')))
    p.stderr.on('end', () => reject(error))
  })

export const print = msg => console.log(`\n\n********** ${msg} **********\n\n`)

export const apply = ({ PATH, script, args = [], debug = false, ignore = [] }) => {
  readdirSync(PATH).forEach(name => {
    const p = normalize(join(PATH, name))
    if (ignore.includes(name)) return
    if (lstatSync(p).isFile()) return
    if (!existsSync(join(p, 'package.json'))) return
    const _script = NPM_NATIVE_SCRIPTS.includes(script)
      ? `npm --prefix ${p} ${script} ${`${args.join(' ')}`.trim()}`
      : `npm --prefix ${p} run "${`${script} ${args.join(' ')}`.trim()}"`
    print(`${name} dependencies`)
    console.log('script', _script)
    exec(_script, debug)
  })
}
