const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const { ModuleFederationPlugin } = require('webpack').container;
const deps = require('./package.json').dependencies;

const PUBLIC_PATH = {
  development: 'http://localhost:4202/',
  production: 'https://soulhay.github.io/amor-lineribus-vue/',
};

module.exports = (env, argv) => {
  const mode = argv.mode === 'production' ? 'production' : 'development';

  return {
    entry: './src/index.js',
    mode,
    devServer: {
      port: 4202,
      headers: { 'Access-Control-Allow-Origin': '*' },
    },
    output: {
      // Explicit rather than 'auto': with 'auto' webpack emits
      // import.meta.url, which cannot be parsed when the shell loads
      // remoteEntry.js as a classic script.
      publicPath: PUBLIC_PATH[mode],
      uniqueName: 'vueRemote',
      scriptType: 'text/javascript',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
    resolve: {
      extensions: ['.js', '.vue'],
    },
    module: {
      rules: [
        { test: /\.vue$/, use: 'vue-loader' },
        { test: /\.s?css$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: JSON.stringify(true),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
      }),
      new VueLoaderPlugin(),
      new ModuleFederationPlugin({
        name: 'vueRemote',
        filename: 'remoteEntry.js',
        library: { type: 'var', name: 'vueRemote' },
        exposes: {
          './Mount': './src/mount.js',
        },
        shared: {
          vue: { singleton: true, requiredVersion: deps.vue },
        },
      }),
      new HtmlWebpackPlugin({ template: './public/index.html' }),
    ],
  };
};