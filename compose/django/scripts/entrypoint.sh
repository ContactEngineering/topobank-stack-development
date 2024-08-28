#!/bin/bash

set -o errexit
set -o pipefail
set -o nounset

# Python environment
source /venv/bin/activate

exec "$@"
