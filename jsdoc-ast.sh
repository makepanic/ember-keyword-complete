#!/usr/bin/env bash

# Script to generate the jsdoc AST for this addon

set -e

if ! which jq >/dev/null; then
    echo "requires jq"
    exit 1
fi

ADDON_NAME="ember-keyword-complete"

PWD=$(pwd | sed 's_/_\\/_g')
CONF_PATH="tests/dummy/config/"
AST_FILE="jsdoc-ast.json"

./node_modules/.bin/jsdoc -X -r addon \
  | sed "s/${PWD}/${ADDON_NAME}/g" \
  | jq 'map(select(has("undocumented")|not))' \
  > ${CONF_PATH}${ADDON_NAME}.ast.json
