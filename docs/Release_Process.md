# Release Process

# Table of contents
- [Prerequisite](#prerequisite)
- [Release flow](#release-flow)
  - [Triggering the release](#triggering-the-release)
  - [Manual process](#manual-process)


## Prerequisite
Before releasing our application to our `test` and `prod` environments, 
an essential step is to add a tag to our sqitch plan, to identify 
which database changes are released to prod and should be immutable.

Additionally, to facilitate identification of the changes that are released 
and communication around them, we want to:

- bump the version number, following [semantic versioning](https://semver.org/)
- generate a change log, based on the commit messages using the 
  [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) format

To make this process easy, we use [release-it](https://github.com/release-it/release-it).

## Release flow

### Triggering the release
Once PO moves JIRA ticket to Sprint done, 
it will check a checkbox on the PR "Check to trigger automatic release process".

This will run the processes listed under ["Manual process"](#manual-process).

The resulting changes of the release process will be made by the "ccbc-service-account",
which is a GitHub account setup to handle automatic git steps.

### Manual process
1. create a `chore/release` branch using 
   [this workflow](https://github.com/bcgov/CONN-CCBC-portal/actions/workflows/create-release-pr.yaml)
2. set the upstream with `git push -u origin chore/release`
3. run `make release` and follow the prompts
4. create a pull request
5. once the pull request is approved, merge using merge button on GitHub UI. 
   Only commits that are tagged can be deployed to test and prod.

If you want to override the version number, which is automatically determined 
based on the conventional commit messages being released, 
you can do so by passing a parameter to the `release-it` command, e.g:

```shell
yarn release-it 1.0.0-rc.1
```
