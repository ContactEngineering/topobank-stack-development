#!/bin/sh

set -o errexit
set -o nounset

echo "-> Starting Celery worker..."

# default and celery are default queue names and need to be handled by some worker
celery -A topobank.taskapp worker -l INFO -Q default,celery,manager,analysis
