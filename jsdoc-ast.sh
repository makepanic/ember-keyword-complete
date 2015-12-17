#!/usr/bin/env bash

ADDON_NAME="ember-keyword-complete"

PWD=$(pwd | sed 's_/_\\/_g')
CONF_PATH="tests/dummy/config/"
AST_FILE="jsdoc-ast.json"

jsdoc -X -r addon \
  | sed "s/${PWD}/${ADDON_NAME}/g" \
  | jq 'map(select(has("undocumented")|not))' \
  > ${CONF_PATH}${ADDON_NAME}.ast.json
