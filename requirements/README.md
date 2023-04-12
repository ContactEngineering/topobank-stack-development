Do not commit the compiled development.txt in case it contains secret access tokens.

To (re-)generate a `development.txt` with fixed package versions, use

```console
python3 -m venv venv
source venv/bin/activate

pip install --upgrade pip
pip install wheel
pip install pip-tools

make
```

from within this directory.
