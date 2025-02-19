#!/usr/bin/env bash

# Check if there are changes in the db folder
if git diff --quiet HEAD^ HEAD -- db; then
  echo "No changes in the db folder. Skipping sqitch tag."
else
  echo "Changes detected in the db folder. Running sqitch tag."
  docker pull sqitch/sqitch
  curl -L https://git.io/JJKCn -o sqitch && chmod +x sqitch
  ./sqitch --chdir db tag "$1" -m "release v$1"
fi
