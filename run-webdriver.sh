#!/usr/bin/env bash

# no set -e because we want to kill the ember process

ember build -dev
cd dist
python2 -m SimpleHTTPServer 7000 &
SERVER_PID=$!

echo "started dummy server at ${SERVER_PID}"

cd ..

mocha -b --recursive -R spec -c -t 60000 tests/webdriver
MOCHA_EXIT=$?

kill ${SERVER_PID}
exit ${MOCHA_EXIT}
