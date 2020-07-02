const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  context: __dirname,
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
  devtool: slsw.lib.webpack.isLocal ? 'cheap-module-eval-source-map' : 'source-map',
  resolve: {
    extensions: ['.ts'],
    symlinks: false,
    cacheWithContext: false,
    alias: {
      '@authorizers': path.resolve(__dirname, 'src', 'authorizers'),
      '@helpers': path.resolve(__dirname, 'src', 'helpers'),
      '@routes': path.resolve(__dirname, 'src', 'routes'),
      '@services': path.resolve(__dirname, 'src', 'services')
    }
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.dist'),
    filename: '[name].js',
  },
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.(tsx?)$/,
        loader: 'ts-loader',
        exclude: [
          [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, '.serverless'),
            path.resolve(__dirname, '.webpack'),
          ],
        ],
        options: {
          transpileOnly: true,
          experimentalWatchApi: true,
        },
      },
    ],
  },
  performance: {
    hints: false
  },
  plugins: [
    // new ForkTsCheckerWebpackPlugin({
    //   eslint: {
    //     files: './**/*.{ts,tsx,js,jsx}',
    //     options: {
    //       cache: true
    //     }
    //   }
    // })
  ]
};
