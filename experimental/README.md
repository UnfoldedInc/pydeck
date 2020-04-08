# gatsby-based website generator

This experiment builds the `pydeck` website using the `gatsby-theme-ocular` gatsby-based website generater (used by most of the vis.gl frameworks including deck.gl), instead of sphinx documentation generator.

- The advantage of this approach would be that it uses the same tooling as the rest of the vis.gl suite. 
- As that tooling evolves, aligning with ocular might become increasingly compelling.
- The downside is that extra conversion tooling is needed, and the result looks less "Pythonic".

## Notes

`pydeck` docs (in the deck.gl repo) are curretly written in rst format, not markdown. This is to support sphinx doc generation per Python conventions. The output is currently not very pleasing (though it could likely be improved with a better theme).

We currently do a preconversion of rst to markdown before running gatsby. There is also a [`gatsby-plugin-rst`](https://github.com/rst-js/rst-js#readme). The documentation seems poor but it could be worth an investigation.

