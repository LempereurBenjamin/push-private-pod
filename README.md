# push-private-pod
Push to private CocoaPods repository.
## Inputs

## `repo-url`

**Required** Private repo source URL.

## `repo-name`

**Required** Private repo name.

## `pod-version`

**Required** Pod version.

## `push-args`

Lint arguments. Default ''.

## `podspec-path`

Podspec relative path from Github Workspace. Default ''.

## Outputs

None

## Example usage

uses: LempereurBenjamin/push-private-pod@v1.0
with:
  repo-url: 'https://https://github.com/LempereurBenjamin/push-private-pod.git'
  repo-name: PushRepo
  version: 1.1
  podspec-path: generated/project
