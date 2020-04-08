#/bin/sh

cd deck.gl/bindings/pydeck

# If you've never done any Python setup for pydeck
make pre-init

# You need python3
python --version
which python

# If not your default, you can do
cd env
. bin/activate

# Optionally verify again
python --version
which python
