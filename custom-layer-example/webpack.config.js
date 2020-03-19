module.exports = {
  mode: 'development',
  devtool: 'source-map',
  
  output: {
    filename: "bundle.js",
    library: "CustomLayerLibrary",
    libraryTarget: "amd-require"
  },
  entry: {
    main: "./index.js"
  }
};
