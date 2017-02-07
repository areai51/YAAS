'use strict';

const WebpackMerge      = require('webpack-merge'); // used to merge webpack configs
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CommonConfig      = require('./webpack.common.js');
const projectConfig     = require('../../project.config');

/**
 * This function returns the development webpack configuration parameters. This function relies on the webpack common
 * configuration file/function. The common configuration will be merged with the development configuration to provide
 * a common development configuration. This function should be called by every project to begin the process of creating
 * a webpack configuration passable to the webpack compiler.
 * @param  {object} options Options object:
 * {
 *   projectRoot: string path of the project root directory
 * }
 */
module.exports = function(options) {
	return WebpackMerge(CommonConfig(options), {
		devtool: 'cheap-module-eval-source-map',

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
			new ExtractTextPlugin('[name].css')
		]
	});
};
