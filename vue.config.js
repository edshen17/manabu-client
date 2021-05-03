const path = require('path')

module.exports = {
  outputDir: path.resolve(__dirname, '../server/public'),

  devServer: {
      open: process.platform === 'darwin',
      host: '0.0.0.0',
      port: 8080,
      proxy: {
         '/api': {
             target: 'http://localhost:5000',
             changeOrigin: true
         } 
      },
      // https: false,
      // hotOnly: false,
  },

  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "@/styles/_variables.scss";`
      }
    }
    },

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true
    }
  }
}
