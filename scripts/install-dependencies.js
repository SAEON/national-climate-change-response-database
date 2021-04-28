import { join, normalize } from 'path'
import { NPM_SCRIPTS, getDirname, exec, print, apply } from './tools.js'

const __dirname = getDirname(import.meta.url)

/**
 * Install top-level repository dependencies
 */
const REPOSITORY_PATH = normalize(join(__dirname, '../'))
print('Installing repository dependencies')
exec(`npm --prefix ${REPOSITORY_PATH} ${NPM_SCRIPTS.install}`)

/**
 * Install package dependencies
 */
const PACKAGES_PATH = normalize(join(__dirname, '../src/packages'))
apply({ PATH: PACKAGES_PATH, script: NPM_SCRIPTS.install })

/**
 * Install service dependencies
 */
const SERVICES_PATH = normalize(join(__dirname, '../src/services'))
apply({ PATH: SERVICES_PATH, script: NPM_SCRIPTS.install, args: ['--legacy-peer-deps'] })

/**
 * Install tool dependencies
 */
const TOOLS_PATH = normalize(join(__dirname, '../src/tools'))
apply({ PATH: TOOLS_PATH, script: NPM_SCRIPTS.install })
