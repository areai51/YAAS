'use strict';

const _                 = require('lodash');
const webpack           = require('webpack');
const autoprefixer      = require('autoprefixer');
const DefinePlugin      = require('webpack/lib/DefinePlugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const lib               = require('../../lib/index');
const projectConfig     = require('../../project.config');

/**
 * This function returns the common webpack configuration parameters for both Production and Development builds. Projects
 * should probably use the webpack.dev, webpack.prod, or and webpack.test files to start the process of building a webpack
 * configuration passable to the webpack compiler.
 * @param  {object} options Options object:
 * {
 *   projectRoot: string path of the project root directory
 * }
 */
module.exports = function(options) {
	options               = options || {};
	const projectRoot     = options.projectRoot || '';
	const projectMetadata = options.projectMetadata || {};
	const metadata        = lib.getBuildEnvironment(projectMetadata);

	if (_.isEmpty(projectRoot)) {
		throw new Error('Webpack required options object passed to webpack configuration files to contain a `projectRoot` option.');
	}

	if (_.isEmpty(metadata)) {
		throw new Error('A problem was encountered compiling the build metadata. This is most likely a problem with the project metadata options.');
	}

	return {
		/*
		 * Static metadata for index.html
		 *
		 * See: (custom attribute)
		 */
		metadata: metadata,

		/*
		 * Options affecting the resolving of modules.
		 *
		 * See: http://webpack.github.io/docs/configuration.html#resolve
		 */
		resolve: {
			/*
			 * An array of extensions that should be used to resolve modules.
			 *
			 * See: http://webpack.github.io/docs/configuration.html#resolve-extensions
			 *
			 * @TODO: can add more. subject to review
			 */
			extensions: ['', '.ts', '.tsx', '.js', '.json'],

			root: projectRoot,

			// remove other default values
			modulesDirectories: ['node_modules']
		},

		module: {

			/**
			 * An array of applied loaders.
			 *
			 * See: http://webpack.github.io/docs/configuration.html#module-preloaders-module-postloaders
			 */
			loaders: [

				/**
				 * Json loader support for *.json files.
				 *
				 * See: https://github.com/webpack/json-loader
				 */
				{
					test: /\.json$/,
					loader: 'json'
				},

				/**
				 * Raw loader support for *.css files
				 * Returns file content as string
				 *
				 * See: https://github.com/webpack/raw-loader
				 */
				{
					test: /\.css$/,
					loader: 'raw!postcss'
				},

				/**
				 * Raw loader support for *.scss files
				 * Returns file content as string
				 *
				 * See: https://github.com/webpack/raw-loader
				 */
				{
					test: /\.scss$/,
					include: projectConfig.webpackConfig.componentStylesFolder,
					loader: 'raw!postcss!sass'
				},

				{
					test: /\.scss$/,
					exclude: projectConfig.webpackConfig.componentStylesFolder,
					loader: ExtractTextPlugin.extract('css!postcss!sass')
				},

				{
					test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
					loader: 'file?name=assets/[name].[hash].[ext]'
				}
			]
		},

		/**
		 * SASS loader configuration
		 *
		 * See: https://github.com/jtangelder/sass-loader
		 */
		sassLoader: {
			'includePaths': projectConfig.webpackConfig.sassLoaderIncludes
		},

		plugins: [
			/**
			 * Plugin: DefinePlugin
			 * Description: Define free variables.
			 * Useful for having development builds with debug logging or adding global constants.
			 *
			 * Environment helpers
			 *
			 * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
			 *
			 * NOTE: when adding more properties make sure you include them in webpack-definitions.d.ts
			 */
			new DefinePlugin({
				GlobalEnvironment: JSON.stringify(metadata)
			}),

			/**
			 * This plugin provides a common progress bar implementation for all build types. This is necessary to give
			 * developers feedback regarding the build process...which can take a few seconds and may appear locked up without
			 * a progress indicator of some kind.
			 *
			 * See: https://github.com/clessg/progress-bar-webpack-plugin
			 */
			new ProgressBarPlugin({
				format: 'build [:bar] :percent (:elapsed seconds): :msg'
			}),

			/*
			 * Plugin: OccurenceOrderPlugin
			 * Description: Varies the distribution of the ids to get the smallest id length
			 * for often used ids.
			 *
			 * See: https://webpack.github.io/docs/list-of-plugins.html#occurrenceorderplugin
			 * See: https://github.com/webpack/docs/wiki/optimization#minimize
			 */
			new webpack.optimize.OccurenceOrderPlugin(true)
		],

		/**
		 * Html loader advanced options
		 *
		 * See: https://github.com/webpack/html-loader#advanced-options
		 */
		htmlLoader: {
			minimize: true,
			removeAttributeQuotes: false,
			caseSensitive: true,
			customAttrSurround: [
				[/#/, /(?:)/],
				[/\*/, /(?:)/],
				[/\[?\(?/, /(?:)/]
			],
			customAttrAssign: [/\)?\]?=/]
		},

		/**
		 * PostCSS loader for webpack
		 *
		 * See: https://github.com/postcss/postcss-loader
		 */
		postcss: function() {
			return [autoprefixer({
				browsers: [
					'> 5%',
					'last 2 versions',
					'Firefox ESR',
					'Opera 12.1',
					'ie >= 11',
					'ios > 6',
					'Android >= 4.4',
					'not ie <= 10',
					'not op_mini 5.0-8.0'
				]
			})];
		},

		/**
		 * Set up dev server to use build environment variables.
		 */
		devServer: {
			port: metadata.port || '8080'
		},

		/*
		 * Include polyfills or mocks for various node stuff
		 * Description: Node configuration
		 *
		 * See: https://webpack.github.io/docs/configuration.html#node
		 */
		node: {
			global: true,
			process: true,
			module: false,
			clearImmediate: false,
			setImmediate: false
		}
	};
};
