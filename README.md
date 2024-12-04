# BirthdayReminders

Open a preview using:

python -m http.server 8000


The git add, git commit, and git push commands are fundamental to managing changes in Git, allowing you to stage local changes, and push remote repository updates.

**git add**
git add is the command used to start tracking changes made in your repository. It stages changes for the next commit, meaning it marks modifications in your working directory to be stored in a snapshot with the next commit.

Usage
To stage a single file, run:

Terminal
git add <file-name>


To stage all changes in the directory, run:

Terminal
git add .


**git commit**
Once changes are staged with git add, git commit is used to save snapshots of these changes to the project's history. This snapshot allows you to record versions of the codebase at incremental points in time.

Usage
To commit staged changes, use:

Terminal
git commit -m "Commit message describing the changes"


**git push**
After committing changes locally, git push uploads your commits to a remote repository, storing them in an online server, providing redundancy and making them available to other developers.

Usage
To push the current branch and its commits to the remote repository, use:

Terminal
git push origin <branch-name>


If you're pushing to the same branch you've configured as the upstream branch, you can simply use:

Terminal
git push


The upstream branch is the branch that lives on the remote repository, corresponding to your local branch.