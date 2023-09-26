# Project 3 - Weather To Go There

## Cloning Repo:
- Open git bash and CD to the desired location to clone our repo (i.e. `cd C:/Documents/Bootcamp/Project3`).
- Then run the clone command: git clone https://github.com/TechMax14/Project-3.git
- That should be it!

## Pushing Code:
- Whenever one of us wants to push our code from our local computers up to the repo for everyone else to pull down and work on locally, follow these steps:
- Make sure that the new files/code you want to push up are in the repo location on your local machine (i.e. `C:/Documents/Bootcamp/Project3/Project-3`).
- Notice "Project3" is a folder that holds our repo "Project-3," sorry for the confusion lol.
- Then from that location run:
  ```
  git add .
  ```
- Check the status prior to see what files (in red) aren't pushed to the repo already (`git status`).
- Running `git status` after that should highlight the new files being ready to be committed in green.
- Next, run:
  ```
  git commit -m "Your message (i.e. 'Adding starter code to repo blah blah blah')"
  ```
- Last but not least, run:
  ```
  git push
  ```
- That should update our GitHub repo with whatever files/folders you just committed and pushed.
- We can discuss in meet-up sessions whether we want to create separate branches for each of us to work in, etc.
