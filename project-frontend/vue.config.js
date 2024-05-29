const webpack = require('webpack');
const openInEditor = require('launch-editor-middleware');

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(true),
      }),
    ],
  },
  devServer: {
    onBeforeSetupMiddleware(devServer) {
      devServer.app.use('/__open-in-editor', openInEditor());
    },
    hot: true,
  },
};
