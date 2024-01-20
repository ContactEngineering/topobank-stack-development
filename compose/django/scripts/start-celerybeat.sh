#!/bin/sh

set -o errexit
set -o nounset

echo "-> Starting Celery flower..."

celery -A topobank.taskapp flower
