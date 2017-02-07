'use strict';

const webpack           = require('webpack');
const WebpackMerge      = require('webpack-merge'); // used to merge webpack configs
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CommonConfig      = require('./webpack.common.js');
const projectConfig     = require('../../project.config');

module.exports = function(options) {
	return WebpackMerge(CommonConfig(options), {
		devtool: 'source-map',

		module: {
			preLoaders: [
				/**
				 * Source map loader support for *.js files
				 * Extracts SourceMaps for source files that as added as sourceMappingURL comment.
				 *
				 * See: https://github.com/webpack/source-map-loader
				 */
				{
					test: /\.js$/,
					loader: 'source-map',
					exclude: projectConfig.webpackConfig.jsExclude
				}
			],
			loaders: [
				/**
				 * Angular2 Template loader, Typescript loader and Babel loader support for .ts(x) files
				 */
				{
					test: /\.ts(x?)$/,
					exclude: projectConfig.webpackConfig.jsExclude,
					loader: 'babel-loader?presets[]=es2015!ts-loader?compilerOptions' + JSON.stringify({
							removeComments: false,
							sourceMap: false,
							inlineSourceMap: true
						}) + '!angular2-template-loader'
				},
				/**
				 * Babel loader support for .js files
				 */
				{
					test: /\.js$/,
					exclude: projectConfig.webpackConfig.jsExclude,
					loader: 'babel-loader',
					query: {
						presets: ['es2015']
					}
				}
			]
		},

		devServer: {
			historyApiFallback: true,
			stats: 'minimal'
		},

		plugins: [
			new webpack.NoErrorsPlugin(),
			new webpack.optimize.DedupePlugin(),
			new webpack.optimize.UglifyJsPlugin({
				compress: {
					warnings: false
				}
			}),
			new ExtractTextPlugin('[name].[hash].css')
		]
	});
};
