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
pip install flower meson-python ninja flit_core

echo "-> Installing plugins..."
for plugin in ${TOPOBANK_PLUGINS}; do
    echo "-> Installing ${plugin}..."
    git config --global --add safe.directory /development-stack/${plugin}
    pip install -v --no-build-isolation --editable /development-stack/${plugin}[dev]
done

touch /venv/VENV-READY

exit 0