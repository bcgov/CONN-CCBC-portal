## Working together

- Share what you plan to work on to prevent duplication of work

## Working with the Board

### Creating cards:

- Before creating a card, check if the card already exists on the board.
- Card Title: Noum + verb/action
- Add tags - Use the existing ones. Don't create tags. Talk with the team first!
- Add to the proper column/stage
- Add the Epic
- Add the Sprint, if needed

### Communication

- Update the card the Backlog before the Stand-up meeting
- Always mention the card in the conversation
- Communication takes place in the development channel in the Gov Team. Gov Teams is the main channel of communication between PO, Stakeholders and the team

## Meetings

- Not invite everyone to all meetings. Be mindful of each meeting one of the team members should be present. (Required vs Optional)
- Feel free to leave a meeting if you feel you shouldn’t be there.

## Development and Version Control

- Devs can appoint representatives for dev-design syncs
- Branch naming policy is as follows: [issue#]-brief-description. In the event that an issue does not already exist for the changes being made in a branch, one should be made.
- Make draft pull requests early and often to facilitate a transparent process.
- When a PR is ready, post a request for review with a link to the branch in Teams.
- Reviews can be done by the first person who gets to it. If the code needs explaining, request the author to walk you through it.
- Follow peer review best practices by suggesting opportunities to improve code during peer review, merging as soon as the code is better than the code in the target branch and release ready.
- Treat any opportunity for improvement feedback identified during peer review but not implemented in the PR where it was raised as technical debt worthy of a new issue referencing the PR where the comments first came up.
- When necessary, use git rebase to sync a feature branch with main. This keeps a tidier history in git, however, can be destructive, so do so cautiously.

**Guardrails**

- The following guardrails are in place to ensure we keep a clean working tree, while avoiding merging breaking changes into our main branch.
- The default branch for this repo is main.
- All commits must be made to a non-protected branch and submitted via a pull request before they can be merged into main. (There can be no direct commits made to main.)
- Branches are automatically deleted on Github when a PR is merged. Each teammate should set git config fetch.prune true to mirror this behaviour to their local workstation.
- Squash merge has been disabled to increase the efficiency of git bisect.
