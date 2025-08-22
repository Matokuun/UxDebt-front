#!/bin/sh

docker build -t matomaniaco/issue-tracker-front . --no-cache
docker push matomaniaco/issue-tracker-front