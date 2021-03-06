# Definition of Done

> This document lists the agreed-upon practices the team will be using. As they are discussed and changed, update this file accordingly.

## DoD criteria

> The Definition of Done is the agreement that the Dev Team has with the Product Owner on **what needs to be completed** for each user story. **When a story is "Done," nothing else needs to be done** (can I deploy it in production after the sprint review?).

### What do we need to check for each PR? 
- [ ] Code produced (all ‘to do’ items in code completed) 
- [ ] Acceptance Criteria were executed without fail
- [ ] Code commented (to be expanded)
- [ ] Obey “Conventional commits” (https://www.conventionalcommits.org/en/v1.0.0/)
- [ ] Code review (https://google.github.io/eng-practices/review/)
- [ ] Peer reviewed (or produced with pair programming) and meeting development standards ([Google](https://google.github.io/eng-practices/review/reviewer/)) 
- [ ] Unit tests are written and passing 
- [ ] Test coverage > 80%(?) 
- [ ] Any build / deployment / configuration changes are implemented / documented / communicated 
- [ ] Don’t introduce breaking changes. 
- [ ] Don’t (avoid) introducing more tech debt. 
- [ ] Automatic Tests implemented and running 

### What do we need to check to move the card to "PO Review" column?
- [ ] Deployed to the system test environment and passed system tests 
- [ ] Relevant documentation / diagrams produced and / or updated 

### What do we need to check to deploy in Dev?
- [ ] Exploratory Test executed if it applies 
- [ ] GitHub DOCs updated 

### What do we need to check to deploy in Test?
- [ ] Presentation to Stakeholders 
- [ ] User Manual/FAQ updated 
- [ ] PO approval

### What do we need to check to deploy in Prod?
- [ ] 
- [ ] 


## Branching Model Team Agreement

### Deployment Notifications:
---
- Dev 
- Dev -> Test 
- Test -> Prod 


### Guardrails
---
> The following guardrails are in place to ensure we keep a clean working tree, while avoiding merging breaking changes into our main branch. 

- [ ] The default branch for this repo is main. 
- [ ] All commits must be made to a non-protected branch and submitted via a pull request before they can be merged into main. (There can be no direct commits made to main.) 
- [ ] Branches are automatically deleted on Github when a PR is merged. Each teammate should set git config fetch.prune true to mirror this behaviour to their local workstation. 
- [ ] Squash merge has been disabled to increase efficiency of git bisect. 

### Practices
---
> Branch naming policy is as follows: [issue#]-brief-description. In the event that an issue does not already exist for the changes being made in a branch, one should be made. 

- [ ] Make draft pull requests early and often to facilitate a transparent process. 
- [ ] When a PR is ready, post a request for review with a link to the branch in the bcgov/connectivity-intake team in Teams. 
- [ ] Reviews can be done by the first person who gets to it. If the code needs explaining, request the author to walk you through it. 
- [ ] Follow peer review best practices by suggesting opportunities to improve code during peer review, merging as soon as the code is better than the code in the target branch and release ready. 
- [ ] Treat any opportunity for improvement feedback identified during peer review but not implemented in the PR where it was raised as technical debt worthy of a new issue referencing the PR where the comments first came up. 
- [ ] When necessary, use git rebase to sync a feature branch with main. This keeps a tidier history in git, however can be destructive, so do so cautiously. 
- [ ] Team will move to a trunk-based development model 
