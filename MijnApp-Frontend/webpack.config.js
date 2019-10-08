'use strict';

const { resolve, join } = require('path');
const webpack = require('webpack');
const { GenerateSW } = require('workbox-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

const pkg = require('./package.json');

const ENV = process.argv.find((arg) => arg.includes('NODE_ENV=production'))
  ? 'production'
  : 'development';
const IS_DEV_SERVER = process.argv.find((arg) =>
  arg.includes('webpack-dev-server')
);
const OUTPUT_PATH = IS_DEV_SERVER ? resolve('src') : resolve('dist');

const processEnv = {
  NODE_ENV: JSON.stringify(ENV),
  appVersion: JSON.stringify(pkg.version),
};

/**
 * === Copy static files configuration
 */
const copyStatics = {
  copyWebcomponents: [
    {
      from: resolve(
        './node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js'
      ),
      to: join(OUTPUT_PATH, 'vendor'),
      flatten: true,
    },
    {
      from: resolve(
        './node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js'
      ),
      to: join(OUTPUT_PATH, 'vendor'),
      flatten: true,
    },
    {
      from: resolve(
        './node_modules/@webcomponents/webcomponentsjs/bundles/webcomponents-ce.js'
      ),
      to: join(OUTPUT_PATH, 'vendor', 'bundles'),
      flatten: true,
    },
    {
      from: resolve(
        './node_modules/@webcomponents/webcomponentsjs/bundles/webcomponents-sd-ce.js'
      ),
      to: join(OUTPUT_PATH, 'vendor', 'bundles'),
      flatten: true,
    },
    {
      from: resolve(
        './node_modules/@webcomponents/webcomponentsjs/bundles/webcomponents-sd-ce-pf.js'
      ),
      to: join(OUTPUT_PATH, 'vendor', 'bundles'),
      flatten: true,
    },
    {
      from: resolve(
        './node_modules/@webcomponents/webcomponentsjs/bundles/webcomponents-sd.js'
      ),
      to: join(OUTPUT_PATH, 'vendor', 'bundles'),
      flatten: true,
    },
  ],
  copyOthers: [
    {
      from: 'assets/**',
      context: resolve('./src'),
      to: OUTPUT_PATH,
    },
    {
      from: resolve('./src/index.html'),
      to: OUTPUT_PATH,
      flatten: true,
    },
    {
      from: resolve('./src/manifest.json'),
      to: OUTPUT_PATH,
      flatten: true,
    },
    {
      from: resolve('./src/config/config.json'),
      to: OUTPUT_PATH + "/config/",
      flatten: true,
    },
  ],
};

/**
 * Plugin configuration
 */
const renderHtmlPlugins = () => [
  new HtmlWebpackPlugin({
    filename: resolve(OUTPUT_PATH, 'index.html'),
    template: `!!ejs-loader!${resolve('./src/index.html')}`,
    minify: ENV === 'production' && {
      collapseWhitespace: true,
      removeScriptTypeAttributes: true,
      removeRedundantAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeComments: true,
    },
    inject: true,
    compile: true,
    excludeAssets: [/(bundle|polyfills)(\..*)?\.js$/],
    paths: {
      webcomponents: './vendor/webcomponents-loader.js',
    },
  }),
  new HtmlWebpackExcludeAssetsPlugin(),
  new ScriptExtHtmlWebpackPlugin({
    defaultAttribute: 'defer',
  }),
];

const sharedPlugins = [
  new webpack.DefinePlugin({ 'process.env': processEnv }),
  new MomentLocalesPlugin({
    localesToKeep: ['en', 'nl'],
  }),
  ...renderHtmlPlugins(),
];
const devPlugins = [new CopyWebpackPlugin(copyStatics.copyWebcomponents)];
const buildPlugins = [
  new CopyWebpackPlugin(
    [].concat(copyStatics.copyWebcomponents, copyStatics.copyOthers)
  ),
  new GenerateSW({
    swDest: join(OUTPUT_PATH, 'sw.js'),
    skipWaiting: true,
  }),
  new CleanWebpackPlugin({
    cleanOnceBeforeBuildPatterns: [OUTPUT_PATH],
    verbose: true
  }),
];

var plugins;
if (ENV === 'development') {
  plugins = sharedPlugins.concat(devPlugins);
} else {
  plugins = sharedPlugins.concat(buildPlugins);
}

module.exports = {
  mode: ENV,
  entry: './src/index.js',
  output: {
    path: OUTPUT_PATH,
    filename: 'bundle.js',
  },
  devtool: 'cheap-source-map',
  /**
   * HACK: To fix a symlink issue when developing the maki libs.
   *
   * Fixes an issue when using `npm link` and `npm link <package>` with webpack.
   */
  resolve: {
    symlinks: false,
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ['text-loader'],
      },
      {
        test: /\.pcss$/,
        use: ['text-loader', 'postcss-loader'],
      },
      {
        test: /\.js$/,
        // We need to transpile Polymer itself and other ES6 code
        exclude: [/node_modules/, /pdfmake.js$/],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                'env',
                {
                  targets: {
                    browsers: [
                      // Best practice: https://github.com/babel/babel/issues/7789
                      '>=1%',
                      'not ie 11',
                      'not op_mini all',
                    ],
                  },
                  debug: true,
                },
              ],
            ],
            plugins: [['transform-object-rest-spread', { useBuiltIns: true }]],
          },
        },
      },
    ],
  },
  plugins,
  devServer: {
    contentBase: OUTPUT_PATH,
    compress: true,
    overlay: {
      errors: true,
    },
    port: 3000,
    host: '0.0.0.0',
    historyApiFallback: true,
    disableHostCheck: true,
    },
  optimization: {
    splitChunks: {
      cacheGroups: {
        pdfmake: {
          test: /pdfmake/,
          chunks: 'initial',
          name: 'pdfmake',
          enforce: true
        },
      }
    }
  }
};
