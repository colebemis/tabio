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
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'manifest.json'),
        to: path.resolve(__dirname, 'dist/manifest.json'),
      },
      {
        from: path.resolve(__dirname, 'popup.html'),
        to: path.resolve(__dirname, 'dist/popup.html'),
      },
    ]),
  ],
};

if (process.env.NODE_ENV === 'production') {
  config.entry = path.resolve(__dirname, 'src/index.jsx');
  config.devtool = false;
}

module.exports = config;
