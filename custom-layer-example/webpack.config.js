module.exports = {
  mode: 'development',
  devtool: 'source-map',
  
  output: {
    libraryTarget: "umd",
    filename: "bundle.js",
    library: "CustomLayerLibrary"
  },
  entry: {
    main: "./index.js"
  },
  externals: {
    "@deck.gl/layers": {
      commonjs: "deck",
      commonjs2: "deck",
      root: "deck"
    },
    "@deck.gl/core": {
      root: "deck",
      commonjs: "deck",
      commonjs2: "deck"
    }
  }
};
