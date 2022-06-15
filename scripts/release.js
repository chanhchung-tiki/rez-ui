const {execSync, exec} = require('child_process')
const fs = require('fs')

const getPackageJSON = () => {
  const packageJSON = fs.readFileSync('./package.json', 'utf-8')
  return JSON.parse(packageJSON)
}

const setPackageJSONVersion = (version) => {
  const packageJSON = getPackageJSON()
  packageJSON.version = version || '1.0.9'
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
  execSync(
    `npm version ${semanticVersionType} --allow-same-version --commit-hooks false -f`
  )
  // Publish package
  exec('npm publish', (error) => {
    if (error) {
      console.log('An error occur while release package: ', error)
      return
    }
    // Publish code
    execSync('git add .')
    const {version: newVersion} = getPackageJSON()
    execSync(
      `git commit --allow-empty -m 'Bump up package with version ${newVersion}`
    )
    execSync('git push origin master:master && git push --tags')
  })
} catch (error) {
  console.log('An error occur while release package: ', error)
}
