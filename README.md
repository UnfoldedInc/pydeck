# pydeck

This repository is dedicated to hosting `pydeck` documentation on https://pydeck.gl.

> Note: this is just a helper repository that serves the pydeck documentation on the dedicated https://pydeck.gl URL via github pages. The source files from which the pydeck documentation is built is located in the [deck.gl](https://github.com/uber/deck.gl) repository, so any changes the documentation must first be made there.

## Overview/Notes

In contrast to most vis.gl framework documentation websites which have markdown documentation and are built with `gatsby` via the `gatsby-theme-ocular` theme, the `pydeck` documentation is written in `.rst` (ReStructured Text) files and built with `sphinx`.

## Attribution

This helper repository as well as the https://pydeck.gl domain are provided by [Unfolded, Inc](https://www.unfolded.ai).

The source files for documentation is located in the [deck.gl](https://github.com/uber/deck.gl) repository (which is included "in whole" as a git submodule in this repo).

Both this repository and the deck.gl repository are open source and MIT licensed.

## Setup and Build Instructions

### Quick Setup

Building the `pydeck` documentation requires a substantial amount of javascript and python tooling setup. However this repository comes with a `bootstrap` script that should automate the process.

Make sure you have `pip` and `sphinx-doc` installed. On MacOS you can use `brew`:
```
sudo easy_install pip
brew install sphinx-doc
```

```sh
git clone https://github.com/UnfoldedInc/pydeck.git
cd pydeck
git fetch
yarn bootstrap
```

### Build and Deploy

```sh
yarn start   # build and test locally
yarn build   # build for deployment
yarn deploy  # deploy (push to `gh-pages` branch)
```

### Detailed Setup Notes

> Note: The steps below are performed automatically when running `yarn bootstrap`. They are described here for advanced use cases only. Also see [deck.gl/bindings/pydeck/PUBLISH.md]

```bash
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

# To make markdown documentation
cd docs
make markdown

# To create static images and .html files associated with the examples in `examples/`
cd ..
make screenshot-examples
```
