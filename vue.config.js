const path = require('path')
const webpack = require('webpack')
const defaultSettings = require('./src/settings')

const resolve = dir => {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 9528 npm run dev OR npm run dev --port = 9528
const port = process.env.port || 9528 // dev port

module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    disableHostCheck: true,
    proxy: {
      '/api/v1': {
        // target: 'http://localhost:7001',
        target: 'http://106.52.127.198:7001',
        changeOrigin: true
      }
    },
    overlay: {
      errors: true,
      warnings: false
    }
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@style': path.resolve(__dirname, './src/assets/style')
      }
    },
    plugins: [
      // 配置全局变量，而不必频繁地 import 或 required 它们（需在 .eslintrc.js 里的 globals 同步配置以跳过校验）
      new webpack.ProvidePlugin({
        $api: [path.resolve(__dirname, './src/api/index.js'), 'default'],
        $dayjs: 'dayjs'
      })
    ]
  },
  chainWebpack (config) {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch')// TODO: need test

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({ symbolId: 'icon-[name]' })
      .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
    // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      )
  }
}
