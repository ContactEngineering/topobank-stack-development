#!/bin/bash

set -o errexit
set -o pipefail
set -o nounset

echo "-> Installing plugins..."
for plugin in ${TOPOBANK_PLUGINS}; do
  echo "* ${plugin}"
  pip install -e /development-stack/${plugin}[dev]
done
