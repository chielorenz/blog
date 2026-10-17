---
type: article
title: Git shorthands
excerpt: A collection of bash aliases and functions to make working with Git from the command line more enjoyable.
timestamp: 2024-07-06
published: true
---


# Git shorthands

Git shorthands is a collection of bash aliases and functions to make working with Git from the command line more
enjoyable.

These shorthands have emerged over the years from recurring patterns in my workflow, perhaps they can be useful to you
too. Let's how they came to be.

## Why bash?

First of all, why bash? Building a full TUI with [bubbletea](https://github.com/charmbracelet/bubbletea) was tempting,
but in the end I decided to stick with bash mainly because it's already installed on every unix-like system and tames
the scope creep that comes with building a full TUI.

This of course comes with limitations, bash is not the most friendly language to work with, but what I wanted to achieve
was quite simple so I figured it shouldn't be a problem.

## Shorthands

I opted for simple naming rules: keep it short but mnemonic: `git status` became `gs`, `git branch` became `gb`, and so
on. It wasn't always possible to stick with two letters commands, for example `git pull` collides with `git push`.

To check the state of the repository:

```bash
# Get the state of the repository
alias gs="git status"

# List local branches
alias gb="git branch"

# List remote branches
alias gbr="git branch --remotes"

# Show the difference between the working directory and the index
alias gd="git diff"
```

To update the local repository:

```bash
# Fetch all branches
alias gf="git fetch --all"

# Pull the current branch, note that it always fetches before pulling
alias gpull="git fetch && git pull"
```

To commit changes:

```bash
# Add all changes to the index
alias ga="git add"

# Commit changes with a message
alias gc="git commit -m"

# Add all changes and commit with a message
alias gac="git commit -am"
```

_Note that by using these aliases you cannot commit without a message._

To merge a branches:

```bash
# Merge the current branch with another
alias gm="git merge"
```

And finally to create a new branch:

```bash
# Create a new branch and switch to it
alias gn="git checkout -b"
```

## Branch switching

An importand funcionality that is still missing is to switch to an existing branch. I wanted to implement in a "clever"
way to overcome the fact that branch names can get quite long and messy someting. I named it `gg` for "git go", a bash
function which takes a string and checks out on the branch that most resembles it.

```bash
gg () {
	# --format is to keep only branch name
	branches=$(git branch --format='%(refname:short)')

	# --max-count is to keep only first match
	branch=$(echo $branches | grep $1 --max-count 1)

	if ! git show-ref --verify --quiet refs/heads/$branch; then
		echo No branch matching "'$1'" found locally; return;
	fi

	git checkout $branch
}
```

What this does is listing all local branches and searching for the first one that matches the given string. This let's
me checkout branches by typing just enough characters to tell it apart other branches, for example to checkout a
branch named `production` I could use:

```
❯ gg prod
Switched to branch 'production'
```

And to checkout a branch named `release/2.0.4`:

```
❯ gg 0.4
Switched to branch 'release/2.0.4'
```

Obviously this isn't perfect, it could switch to the wrong branch if the given was ambiguous, but usually a quick
`gb` to list all the branches is enough to find the right keywords to make it work.

This command deliberately checks only local branches to limit name collisions when there are dozens if not hundreds of
branches in the remote, but what if the branch is not present locally? The command `ggr` "git go remote" it's meant for
this:

```bash
ggr () {
	# --format is to keep only branch name
	# --all to get local and remote branch
	branches=$(git branch --all --format='%(refname:short)')

	# --max-count is to keep only first match
	branch=$(echo $branches | grep $1 --max-count 1)

	# Ensure to checkout the local branch
	[[ $branch == origin/* ]] && branch=$(echo $branch | cut -c 8-)

	git checkout $branch
}
```

To checkout a remote branch named `feature/auth` I could use:

```
❯ ggr auth
branch 'feature/auth' set up to track 'origin/feature/auth'.
Switched to a new branch 'feature/auth'
```

The joy I've expirienced the first time I `gbr` to list all the remote branches and `ggr` to checkout one of them in
**3 seconds total** is not descrivable 🤩🤩🤩.

## Pretty log

Another common task is to check the history of the repository, for this one I just googled for a good pretty format, I
can't remember where I found it but it's been working great:

```bash
alias gl="git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
```

This spits out a nice graph with the commit hash, the branch, the message, the date and the author:

![gl output screenshot](/posts/git-shorthands/gl-output.png)

## Documenting commands

Event though the commands are mnemonic, it's still forget them sometimes. To help with this I've added a _handmade doc
block_ to each command in the form `# @doc <description>`. For example the `gg` command has this doc block:

```bash
# @doc gg [branch]: Checkout a local git branch by searching for it
```

These doc blocks can be red with this function:

```bash
glist () {
    grep -oh '^# @doc.\+' \
        $filename |                     # match doc tags
        cut -c 8- |                     # remove the '# @doc ' part
        grep '^[^:]\+' --color=always   # color the command name
}
```

That prints out all the commands with their descriptions:

```
❯ glist
gg [branch]: Checkout a local git branch by searching for it
```

## Try it out

To try the shorthands by yourself, you can download the raw file and source from your terminal with:

```bash
curl -O https://raw.githubusercontent.com/chielorenz/git-shorthands/main/git-shorthands.sh
source ./git-shorthands.sh
```

The source code can be found in [this repository](https://github.com/chielorenz/git-shorthands).
