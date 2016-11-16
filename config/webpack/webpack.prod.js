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
				 * Typescript loader support for .ts
				 */
				{
					test: /\.ts$/,
					loader: 'ts',
					query: {
						compilerOptions: {
							removeComments: true
						}
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
