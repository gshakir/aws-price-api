var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  entry:  { lambda: ['babel-polyfill', './src/lambda.js' ] } ,
  target: 'node',
  output: {
    library: "[name]",
    libraryTarget: "commonjs2",
    path: path.join(__dirname, 'build'),
    filename: "[name].js"
  },
  module: {
    loaders: [
      {
          test: /\.js$/, 
          exclude: /node_modules/, 
          loader: 'babel', 
          query: { babelrc: false, presets: ['babel-preset-es2015', 'babel-preset-es2016', 'babel-preset-stage-3'] }
      },
      { test: /\.json$/, loader: 'json-loader' }
    ]
  },
  //externals: nodeModules,
  plugins: [
    new webpack.IgnorePlugin(/\.(css|less)$/),
  ],
  //devtool: 'sourcemap'
}
