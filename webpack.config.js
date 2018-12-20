const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devServer: {
    host: "localhost",
    port: 8081,
    https: false
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  }

};
