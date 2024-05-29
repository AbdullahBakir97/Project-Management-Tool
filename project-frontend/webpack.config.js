const path = require('path');
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const openInEditor = require('launch-editor-middleware');

module.exports = {
  entry: './src/main.js', // Entry point of your application
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory
    filename: 'bundle.js', // Output file name
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'], // Resolve these extensions
    alias: {
      '@': path.resolve(__dirname, 'src'), // Alias for the src directory
    },
    fallback: {
      "fs": false, // Node modules that are not needed in the browser
      "path": require.resolve("path-browserify"),
      "os": require.resolve("os-browserify/browser"),
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/, // Handle .vue files
        loader: 'vue-loader',
      },
      {
        test: /\.js$/, // Handle .js files
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/, // Handle .css files
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|gif|svg)$/, // Handle image files
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(true),
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new VueLoaderPlugin(),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'), // Serve static files from public directory
    },
    historyApiFallback: true, // Serve index.html for all 404 errors (for Vue Router)
    port: 8080,
    hot: true, // Enable Hot Module Replacement
    onBeforeSetupMiddleware(devServer) {
      devServer.app.use('/__open-in-editor', openInEditor());
    },
  },
  devtool: 'source-map', // Enable source maps for better debugging
};
