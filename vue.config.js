const path = require('path');

module.exports = {
  publicPath: '',
  outputDir: path.resolve(__dirname, '../server/dist/server/public'),
  devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
    // https: false,
    // hotOnly: false,
  },
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'src/locales',
      enableInSFC: true,
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@server': path.resolve(__dirname, '../server'),
      },
      extensions: ['.tsx', '.ts', '.js', '.jsx', '.css', '.scss', '.sass', '.vue'],
    },
  },
  transpileDependencies: ['vuetify'],
};
