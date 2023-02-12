const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
require('dotenv').config();

module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  configureWebpack: {
    plugins: [new NodePolyfillPlugin()],
    optimization: {
      splitChunks: {
        chunks: "all",
      },
    },
  }
})
