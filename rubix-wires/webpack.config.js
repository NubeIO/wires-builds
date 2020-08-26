const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const entry = ['./src/client/main.js']; // app
let isDev = process.env.NODE_ENV !== 'production';
isDev && entry.unshift('webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000'); // live reload

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry,
  output: {
    path: path.resolve(__dirname, './dist/public/client/'),
    publicPath: '/client/',
    filename: 'build.js',
  },
  resolve: {
    extensions: ['.js', '.vue', '.ts', '.tsx'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      'public': path.resolve(__dirname, './dist/public'),
      // Using ES5 version for prevent webpack compile ES6 error
      'logplease': 'logplease/es5/index.js',
      // Ignore server-side modules, not used in client-side
      'child_process': 'empty-module',
      'fs': 'empty-module',
      'mqtt': 'empty-module',
      'split': 'empty-module',
      'miio': 'empty-module',
      'serialport': 'empty-module',
      'nodemailer': 'empty-module',
      'slackbots': 'empty-module',
      'influx-db': 'empty-module',
      'modbus-serial': 'empty-module',
      'node-bacnet': 'empty-module',
      'set-ip-address': 'empty-module',
      'ip': 'empty-module',
      'network': 'empty-module',
      'local-devices': 'empty-module',
      'twilio': 'empty-module',
      'dgram': 'empty-module',
      'systeminformation': 'empty-module'
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {},
          // Other vue-loader options go here
        },
      },
      {
        test: /\.js$/,
        loader: 'source-map-loader',
        exclude: /node_modules|dist/,
        enforce: 'pre',
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          objectAssign: 'Object.assign',
          outputPath: 'images',
        },
      },
      {
        test: /\.(styl(us)?|css)$/,
        loader: ['style-loader', 'css-loader'],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'awesome-typescript-loader',
      },
      {
        test: /\.pug$/,
        loader: 'pug-plain-loader',
      },
      {
        test: /\.s(c|a)ss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            // Requires sass-loader@^8.0.0
            options: {
              implementation: require('sass'),
              sassOptions: {
                fiber: require('fibers'),
                includePaths: [path.resolve(__dirname, './node_modules/material-icons/iconfont')],
              },
            },
          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // live reload
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // vue loader
    new VueLoaderPlugin(),
    // expose jquery's $ for imports
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
  ],
  devServer: {
    historyApiFallback: true,
    noInfo: true,
  },
  performance: {
    hints: false,
  },
  devtool: '#eval-source-map',
};

if (!isDev) {
  module.exports.devtool = '#source-map';
  // https://vue-loader-v14.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    // short-circuits all Vue.js warning code
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
  ]);
}
