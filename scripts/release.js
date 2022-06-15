const {execSync} = require('child_process')
const fs = require('fs')

const getPackageJSON = () => {
  const packageJSON = fs.readFileSync('./package.json', 'utf-8')
  return JSON.parse(packageJSON)
}

const setPackageJSONVersion = (version) => {
  const packageJSON = getPackageJSON()
  packageJSON.version = version
  fs.writeFileSync('./package.json', JSON.stringify(packageJSON, null, 2))
}

const argv = process.argv.slice(2)
const indexVersionType = argv.findIndex((arg) => arg === '--version-type')
const versionTypes = ['major', 'minor', 'patch']
let semanticVersionType = 'minor'
if (
  indexVersionType !== -1 &&
  versionTypes.includes(argv[indexVersionType + 1])
) {
  semanticVersionType = argv[indexVersionType + 1]
}

try {
  execSync('npm run build')
  // Bump up version and add tag
  // (Require the tree of git clean: not exist files change)
  execSync(
    `npm version ${semanticVersionType} --allow-same-version -m 'Bump up package with version %s'`
  )
  // Publish package
  execSync('npm publish')
  // Publish code
  execSync('git push origin master:master && git push -f --tags')
} catch (error) {
  console.group('Error detail:')
  console.log('An error occur while release package: ', error)
  console.groupEnd()
}
