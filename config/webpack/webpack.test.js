'use strict';

const path              = require('path');
const webpack           = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const projectConfig     = require('../../project.config');

/**
 * We need to define the index.html file we want to load when doing a development build. This file will be served up
 * by webpack when performing a development build.
 *
 * @TODO: can more to 'project.config.js' file, used in multiple places. subject to review.
 */
const indexHTML = path.resolve(projectConfig.projectSrc, 'index.html');

module.exports = {
    /**
	 * Change dev tool to inline source maps to support code coverage mapping to TS source.
	 */
	devtool: 'inline-source-map',

    module: {
		loaders: [
			/**
			 * Html loader support for *.html
			 * Returns file content as string, and minimizing the HTML when required.
			 *
			 * This cannot be included in the common webpack configuration exposed by frontend-config because we need to add
			 * an exclude when we are using the HTMLWebpackPlugin.
			 *
			 * See: https://github.com/webpack/html-loader
			 */
			{
				test: /\.html$/,
				loader: 'html',
				exclude: [indexHTML]
			}
		],

		/**
		 * An array of applied post-loaders.
		 *
		 * See: http://webpack.github.io/docs/configuration.html#module-preloaders-module-postloaders
		 */
		postLoaders: [

			/**
			 * Instruments JS files with Istanbul for subsequent code coverage reporting.
			 * Instrument only testing sources.
			 *
			 * See: https://github.com/deepsweet/istanbul-instrumenter-loader
			 */
			{
				test: /\.(js|ts)$/,
				loader: 'istanbul-instrumenter',
				exclude: projectConfig.karmaConfig.jsExclude
			}

		]
	},

    /**
	 * The base webpack config adds the below plugins. If you would like to add more, like the commons chunk plugin, you
	 * will need to define them here.
	 *
	 * Dev Plugins:
	 * new DefinePlugin(metadata),
	 * new ProgressBarPlugin({
	 *   format: 'build [:bar] :percent (:elapsed seconds): :msg'
	 * }),
	 * new ForkCheckerPlugin(),
	 * new webpack.optimize.OccurenceOrderPlugin(true),
	 *
	 * Prod Plugins:
	 * new DefinePlugin(metadata),
	 * new ProgressBarPlugin({
	 *   format: 'build [:bar] :percent (:elapsed seconds): :msg'
	 * }),
	 * new ForkCheckerPlugin(),
	 * new webpack.optimize.OccurenceOrderPlugin(true),
	 * new webpack.NoErrorsPlugin(),
	 * new webpack.optimize.DedupePlugin(),
	 * new webpack.optimize.UglifyJsPlugin({
	 *   compress: {
	 *     warnings: false
	 *   }
	 * }),
	 */
	plugins: [

		/**
		 * Host an index.html file. Important for local builds when using webpack dev server. This can stay here even for
		 * prod builds.
		 */
		new HtmlWebpackPlugin({
			template: indexHTML,
			chunksSortMode: 'dependency'
		}),

		/*
		 * Plugin: CopyWebpackPlugin
		 * Description: Copy files and directories in webpack.
		 *
		 * Copies project static assets.
		 *
		 * See: https://www.npmjs.com/package/copy-webpack-plugin
		 */
		new CopyWebpackPlugin([{
			from: path.resolve(projectConfig.projectSrcAssets),
			to: path.resolve(projectConfig.projectDistAssets)
		}]),

		/**
		 * The following two plugins force karma to test a moch production build.
		 */
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		})
	]
};
