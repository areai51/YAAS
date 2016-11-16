'use strict';

const _             = require('lodash');
const webpackMerge  = require('webpack-merge'); // used to merge webpack configs
const projectConfig = require('../project.config');

/**
 * We must assign a webpack config object to the webpack property of the karma configuration object. However, not all
 * the plugins and options for webpack are compatible with karma. For that reason, we build a seperate webpack
 * configuration for karma, seperate of the webpack.config file in the root of the project.
 */

/**
 * Build the metadata object. This is an options object that is passed to the webpack build files
 * to properly create the webpack configuration. This object should also contain any data we may want to pass into the
 * body of the HTML file like a build number, sha, tag name, and/or date.
 *
 * It must contain the following properties:
 * projectRoot: the root directory path of the current project
 *
 * This object should also be used to override buildEnvironment parameters:
 * host: host to bind dev environment to (usually set with cli argument --host=<host>)
 * port: port to bind dev environment to (usually set with cli argument --port=<host>)
 * production: flag to enable production build (usually set with cli argument --production)
 * development: flag to enable development build (usually set with cli argument --development)
 * open: flag to automatically open the browser during build (usually set with cli argument --open)
 * api_endpoint: path used to proxy all API calls to (usually set with cli argument --api-endpoint=<url>)
 */
const metadata = {
	projectRoot: projectConfig.projectRoot
};
const baseWebpackConfig = require('./webpack/webpack.dev.js')(metadata);

let projectWebpackConfig = {
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
				loader: 'html'
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
	}
};

module.exports = function(config) {
	/**
	 * Load the base karma config onto the config object.
	 */
	require('./karma/karma.conf')(config);

	/*
	 * Entry point, test environment builder
	 * list of files/patterns to load in the browser
	 */
	config.files = config.files.concat([{
		pattern: './karma/karma-test-shim.js',
		watched: false
	}]);

	/**
	 * We need to add a preprocessor entry for each webpack source directory. If all source code is contained within a single
	 * source directory, there should only be one entry. However, some projects may build multiple applications from different
	 * source directories. Be sure to list each one of those here. These source directories should contain the following
	 * preprocessor:
	 *   webpack: to process the source directory with webpack (webpack entry should exist in webpack config)
	 *   sourcemap: to properly load source maps for code coverage
	 *   coverage: to perform code coverage calculations/reporting
	 */
	config.preprocessors = _.assign({}, config.preprocessors, {
		'./karma/karma-test-shim.js': [
			'webpack'
		],
		'../src/**/*.ts': [
			'webpack',
			'sourcemap'
		]
	});

	config.webpack = webpackMerge.smart(baseWebpackConfig, projectWebpackConfig);

	// Change settings to enable chrome based debugging of the tests
	config.reporters = ['mocha'];
	config.autoWatch = true;
	config.browsers = ['Chrome'];
	config.singleRun = false;

	return config.set(config);
};
