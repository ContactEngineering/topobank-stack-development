#!/bin/sh

set -o errexit
set -o nounset

echo "-> Starting Celery beat..."

celery -A topobank.taskapp beat
