#!/bin/sh

set -o errexit
set -o nounset

echo "-> Starting Celery worker.."

celery -A topobank.taskapp worker -l INFO
