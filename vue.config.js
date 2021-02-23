const path = require('path')

module.exports = {
    outputDir: path.resolve(__dirname, '../server/public'),
    devServer: {
        open: process.platform === 'darwin',
        host: '0.0.0.0',
        port: 8080,
        proxy: {
           '/api': {
               target: 'http://localhost:5000'
           } 
        },
        // https: false,
        // hotOnly: false,
    },
}