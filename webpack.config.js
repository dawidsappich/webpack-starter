const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); //generates index html
const ExtractTextPlugin = require("extract-text-webpack-plugin"); //extractstext into seperate file like css
const webpack = require('webpack');
const bootstrapWebpackConfig = require('./webpack.bootstrap.config');

const isProductionEnv = process.env.NODE_ENV == 'production';
const cssDevLoader = ['style-loader', 'css-loader', 'sass-loader'];
const cssProdLoader = ExtractTextPlugin.extract({
	use: ['css-loader', 'sass-loader']
});

const cssConfig = isProductionEnv ? cssProdLoader : cssDevLoader;
const bootstrapEntryPoint = isProductionEnv ? bootstrapWebpackConfig.prod : bootstrapWebpackConfig.dev;

module.exports = {
	entry: {
		app: './src/app.js',
		boostrap: bootstrapEntryPoint
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].bundle.js'
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
		open: true,
		// turn on Hot Module Replacemnt
		hot: true
	},
	module: {
		rules: [
			// transpile scss to css
			// executes from right to left
			{ test: /\.scss$/, use: cssConfig },
			{
				// transpile es6 to es2015 (es5)
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['es2015']
					}
				}
			},
			{
				// watch for most common image files
				test: /\.(jpe?g|png|gif|svg)$/i,
				// output images with hash of 6 letters in folder assets
				// publicPath to link src to right path in img tags
				use: ['file-loader?name=assets/[hash:6].[ext]']
			},
			// load icon fonts
			{ test: /\.(woff2?|svg)$/, loader: 'url-loader?limit=10000&name=fonts/[name].[ext]' },
			{ test: /\.(ttf|eot)$/, loader: 'file-loader?name=fonts/[name].[ext]' },
			// load jquery
			{ test:/bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/, loader: 'imports-loader?jQuery=jquery' }
		]
	},
	plugins: [
		// generate index.html with bundled javasscript
		new HtmlWebpackPlugin({
			title: 'Project',
			template: './src/index.html',
			hash: true
		}),
		// extract css into separate file
		new ExtractTextPlugin({
			disable: !isProductionEnv,
			filename: 'css/[name].css',
			allChunks: true
		}),
		// enable hot module replacemnt
		new webpack.HotModuleReplacementPlugin()
	]
}