#!/bin/sh

set -o errexit
set -o nounset

echo "-> Installing plugins"
for plugin in ${TOPOBANK_PLUGINS}; do
  echo "* ${plugin}"
  pip install -e /plugin-${plugin}
done

echo "-> Starting Celery worker.."

celery -A topobank.taskapp worker -l INFO
