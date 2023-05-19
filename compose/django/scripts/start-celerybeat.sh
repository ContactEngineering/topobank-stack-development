#!/bin/sh

set -o errexit
set -o nounset

echo "-> Starting Celery beat.."

rm -f './celerybeat.pid'
celery -A topobank.taskapp beat -l INFO
