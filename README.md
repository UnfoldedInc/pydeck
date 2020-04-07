# pydeck

Github pages repo for pydeck.gl documentation.

Note: this is a merely a helper repository to serve the built pydeck documentation on github pages. The main body of the pydeck documentation and code is in the deck.gl repository, which is a submodule of this repo.


## Overview/Notes

`pydeck` docs (in the deck.gl repo) are curretly written in rst format, not markdown. This is to support sphinx doc generation per Python conventions. The output is currently not very pleasing (though it could likely be improved with a better theme).

This repo builds a website using the `gatsby-theme-ocular` gatsby-based website generater (used by most of the vis.gl frameworks including deck.gl).


## Attribution

This helper repository as well as the pydeck.gl domain are provided by [Unfolded, Inc](www.unfolded.ai).

Most of the source documentation is in Uber's [deck.gl](https://github.com/uber/deck.gl) repository (which is included "in whole" as a git submodule in this repo).


## TODO 

We currently do a preconversion of rst to markdown before running gatsby. There is also a [`gatsby-plugin-rst`](https://github.com/rst-js/rst-js#readme). The documentation seems poor but it could be worth an investigation.


## Detailed Setup Notes

Make sure you have `pip` and `sphinx-doc` installed
```
sudo easy_install pip
brew install sphinx-doc
```

```bash
git clone https://github.com/UnfoldedInc/pydeck.git
cd pydeck
get fetch
yarn bootstrap
```

See [deck.gl/bindings/pydeck/PUBLISH.md]

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

