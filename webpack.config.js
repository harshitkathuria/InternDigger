const path = require('path');

module.exports = {
  entry: ['@babel/polyfill', './public/js/main.js'],
  output: {
    filename: 'main.bundle.js',
    path: path.resolve(__dirname, 'public/js')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  devServer: {
    contentBase: './destination',
    open: true
  }
}