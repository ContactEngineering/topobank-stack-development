#!/bin/bash -x

set -o errexit
set -o pipefail
set -o nounset

if [ -f "/venv/VENV-READY" ]; then
    echo "Virtual environment already exists"
    exit 0
fi

python3 -m venv /venv
source /venv/bin/activate

pip install --upgrade pip
pip install -v -r /development-stack/requirements/development.txt
pip install flower

echo "-> Installing plugins..."
for plugin in ${TOPOBANK_PLUGINS}; do
    pip install -v -e /development-stack/${plugin}[dev]
done

touch /venv/VENV-READY

exit 0