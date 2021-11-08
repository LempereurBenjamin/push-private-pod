const core = require('@actions/core')
const exec = require('@actions/exec')
const fs = require('fs')
const path = require('path')

async function main() {

    const spec_owner = core.getInput('repo-owner')
    const spec_repo_token = core.getInput('repo-token')
    const spec_repo_name = core.getInput('repo-name')
    const pod_version = core.getInput('pod-version')
    const podspec_path = core.getInput('podspec-path')
    const args = core.getInput('push-args')
    
    function findSpec() {
        const files = fs.readdirSync(`${process.env.GITHUB_WORKSPACE}/${podspec_path}`)
    
        for (var i in files) {
            if (path.extname(files[i]) === ".podspec") {
                return files[i]
            }
        }
    }
    
    const podspec = findSpec()

    if (!podspec) {
        core.setFailed('No podspec file found.')
        return
    }

    const podspec_full_path = `${process.env.GITHUB_WORKSPACE}/${podspec_path}/${podspec}`

    await exec.exec('gem install cocoapods')
    await exec.exec('gem install fastlane')

    await exec.exec(`git clone https://oauth2:${spec_repo_token}@github.com/${spec_owner}/${spec_repo_name}.git`)
    await exec.exec(`git tag ${pod_version}`)
    await exec.exec('git push --tags')

    // add spec repo
    await exec.exec(`pod repo add ${spec_repo_name} https://oauth2:${spec_repo_token}@github.com/${spec_owner}/${spec_repo_name}.git`)

    // change version in spec file
    await exec.exec(`fastlane run version_bump_podspec path:${podspec_full_path} version_number:${pod_version}`)

    // pod repo push
    await exec.exec(`pod repo push ${spec_repo_name} ${podspec_full_path} ${args}`)
}


main().catch(err => core.setFailed(err.message))