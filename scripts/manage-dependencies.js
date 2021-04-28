import { join, normalize } from 'path'
import { NPM_SCRIPTS, getDirname, exec, print, apply } from './tools.js'

// TODO - for each ncu command, check if package.json is changed. if so, run npm install

const __dirname = getDirname(import.meta.url)

const ARGS = process.argv.slice(2)

/**
 * Top-level repository dependencies
 */
const REPOSITORY_PATH = normalize(join(__dirname, '../'))
print('Checking repository dependencies')
exec(`npm --prefix ${REPOSITORY_PATH} run "${`${NPM_SCRIPTS.ncu} ${ARGS.join(' ')}`.trim()}"`)

/**
 * Package dependencies
 */
const PACKAGES_PATH = normalize(join(__dirname, '../src/packages'))
apply({ PATH: PACKAGES_PATH, script: NPM_SCRIPTS.ncu, args: ARGS })

/**
 * Service dependencies
 */
const SERVICES_PATH = normalize(join(__dirname, '../src/services'))
apply({ PATH: SERVICES_PATH, script: NPM_SCRIPTS.ncu, args: ARGS })

/**
 * Tool dependencies
 */
const TOOLS_PATH = normalize(join(__dirname, '../src/tools'))
apply({ PATH: TOOLS_PATH, script: NPM_SCRIPTS.ncu, args: ARGS })
