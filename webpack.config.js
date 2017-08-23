const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); //generates index html
const ExtractTextPlugin = require("extract-text-webpack-plugin"); //extractstext into seperate file like css


module.exports = {
	entry: './src/app.js',
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'app.bundle.js'
	},
	devServer: {
		// serve files from dist to localhost
		contentBase: path.join(__dirname, 'dist'),
		// gzip files
		compress: true,
		port: 9000,
		// Only output when errors or new compilation happen
		stats: 'minimal',
		// open a new browser window when starting for the first time
		open: true
	},
	module: {
		// include css file in index.html
		rules: [
			// executes from right to left
			{ test: /\.scss$/, use: ExtractTextPlugin.extract(['css-loader', 'sass-loader']) }
		]
	},
	plugins: [
		// generate index.html with bundled javasscript
		new HtmlWebpackPlugin({
			title: 'Project',
			template: './src/index.html',
			hash: true
		}),
		new ExtractTextPlugin({
			filename: 'app.css',

		})
	]
}