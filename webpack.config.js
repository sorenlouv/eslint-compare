const path = require('path');
const webpack = require('webpack');
const env = JSON.stringify(process.env.NODE_ENV || 'development');
console.log('Current env', env);

const config = {
	context: path.join(__dirname, 'src'),
	devtool: 'eval',
	entry: './index.jsx',
	output: {
		path: path.join(__dirname, 'docs'),
		publicPath: 'docs',
		filename: 'app.js'
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': env
		})
	],
	module: {
		loaders: [
			{
				test: /\.png$/,
				loader: 'url-loader?limit=8192'
			},
			{
				test: /\.scss$/,
				loaders: ['style', 'css', 'sass']
			},
			{
				test: /\.json$/,
				loader: 'json'
			},
			{
				test: /\.jsx|.js$/,
				exclude: /node_modules/,
				loader: 'babel'
			}
		]
	}
};

if (process.env.NODE_ENV === 'production') {
	config.devtool = 'source-map';
	config.plugins.push(new webpack.optimize.UglifyJsPlugin({
		compress: { warnings: false },
		output: {
			comments: false
		}
	}));
} else {
	config.devServer = {
		inline: true
	};
}

module.exports = config;
