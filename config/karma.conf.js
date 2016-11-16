'use strict';

const path              = require('path');
const _                 = require('lodash');
const webpack           = require('webpack');
const webpackMerge      = require('webpack-merge'); // used to merge webpack configs
const projectConfig     = require('../project.config');

/**
 * We must assign a webpack config object to the webpack property of the karma configuration object. However, not all
 * the plugins and options for webpack are compatible with karma. For that reason, we build a seperate webpack
 * configuration for karma, seperate of the webpack.config file.
 */

/**
 * Build the metadata object. This is an options object that is passed to the frontend-config webpack build files
 * to properly create the webpack configuration. This object should also contain any data we may want to pass into the
 * body of the HTML file like a build number, sha, tag name, and/or date.
 *
 * It must contain the following properties:
 * projectRoot: the root directory path of the current project
 *
 * This object should also be used to override buildEnvironment parameters:
 * host: host to bind dev environment to (usually set with cli argument --host=<host>
 * port: port to bind dev environment to (usually set with cli argument --port=<host>
 * production: flag to enable production build (usually set with cli argument --production=
 * development: flag to enable development build (usually set with cli argument --development
 * open: flag to automatically open the browser during build (usually set with cli argument --open
 * api_endpoint: path used to proxy all API calls to (usually set with cli argument --api-endpoint=<url>
 */
const metadata = {
	projectRoot: projectConfig.projectRoot
};
const buildEnvironment = require('../lib').getBuildEnvironment(metadata);

let baseWebpackConfig;
if (buildEnvironment.production) {
	baseWebpackConfig = require('./webpack/webpack.prod.js')(metadata);
} else {
	baseWebpackConfig = require('./webpack/webpack.dev.js')(metadata);
}

let testWebpackConfig = require('./webpack/webpack.test.js');

module.exports = function(config) {
	/**
	 * Load the base karma config onto the config object.
	 */
	require('./karma/karma.conf')(config);

	/*
	 * Entry point / test environment builder
	 * list of files / patterns to load in the browser
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
     *
     * @TODO: Need to see whether it is a good approach to move source directories list in 'project.config.js' file or hard code here for simplicity.
     * Subject to review.
	 */
	config.preprocessors = _.assign({}, config.preprocessors, {
		'./karma/karma-test-shim.js': [ 'webpack' ],
		'../src/**/!(*.spec).(ts|js)': [ 'webpack', 'sourcemap', 'coverage' ]
	});

	config.webpack = webpackMerge.smart(baseWebpackConfig, testWebpackConfig);

	/**
	 * Enable chrome based debugging. By default, PhantomJS is used.
	 * If you have PhantomJS install then remove below.
	 */
	config.browsers = ['Chrome'];

	/**
	 * Console log the karma configuration for debugging.
	 */
	console.log('Karma Configuration:');
	// console.log(JSON.stringify(config, null, 2));

	return config.set(config);
};
