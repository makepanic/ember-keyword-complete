#!/usr/bin/env bash

# Stop on error
set -e

GH_USER_NAME="Travis-CI"
GH_USER_MAIL="travis@example.com"
COMMIT_MSG="Deployed to Github Pages"

BRANCH_NAME=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')

echo "branch=${BRANCH_NAME}"

if [ "${BRANCH_NAME}" == "master" ]
  then
  rm -rf dist || exit 0;
  mkdir dist;
  ember build -dev

  ( cd dist
   git init
   git config user.name ${GH_USER_NAME}
   git config user.email ${GH_USER_MAIL}
   git add .
   git commit -m "${COMMIT_MSG}"
   git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1
  )
else
  echo "Will not publish from a branch other than master."
fi
