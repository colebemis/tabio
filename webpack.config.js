const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = {
  context: __dirname,
  entry: ['react-devtools', path.resolve(__dirname, 'src/index.jsx')],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        ignore: ['.DS_Store'],
        from: path.resolve(__dirname, 'public'),
        to: path.resolve(__dirname, 'dist'),
      },
    ]),
  ],
};

if (process.env.NODE_ENV === 'production') {
  config.entry = path.resolve(__dirname, 'src/index.jsx');
  config.devtool = false;
}

module.exports = config;
