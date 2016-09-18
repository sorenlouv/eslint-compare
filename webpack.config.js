var path = require('path');

module.exports = {
    devtool: 'eval',
    entry: [
        'webpack-dev-server/client?http://localhost:3000',
        './src/index.jsx'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/static/'
    },
    module: {
        loaders: [
            { test: /\.png$/, loader: 'url-loader?limit=8192' },

            // json
            { test: /\.json$/, loader: 'json' },

            // react (js)
            {
                test: /\.jsx$/,
                loaders: ['babel'],
                include: path.join(__dirname, 'src')
            }
        ]
    }
};
