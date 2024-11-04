#!/bin/bash

echo "command: $0"
echo "command: $@"

set -o errexit
set -o pipefail
set -o nounset

exec "$@"
