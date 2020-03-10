Demo Composite Layer
===================

This directory provides an example of the minimum code necessary to write a custom
layer for use in pydeck.

To create the bundle that you can pass to pydeck via a URI, run 

```
cd custom-layer-example
# install webpack using yarn
yarn
# run webpack from the installed code (using npx since webpack not in path)
npx webpack
```

This builds in a gitignored `dist` folder.

You can copy this file to e.g. a CDN after this, or set up a local server.
