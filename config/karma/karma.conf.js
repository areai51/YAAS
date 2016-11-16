'use strict';

const path          = require('path');
const projectConfig = require('../../project.config');

module.exports = function(config) {

	config.set({

		// base path that will be used to resolve all patterns (e.g. files, exclude)
		basePath: '',

		/*
		 * Test Frameworks to use
		 *
		 * available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		 */
		frameworks: ['jasmine', 'source-map-support'],

		// list of files to exclude
		exclude: [],

		/*
		 * Entry point / test environment builder
		 * list of files / patterns to load in the browser
		 *
		 * we are building the test environment in ./spec-bundle.js
		 */
		files: [],

		/*
		 * preprocess matching files before serving them to the browser
		 * available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		 */
		preprocessors: {},

		/**
         * This JSON file is "intermediate", in post-test script we use remap-istanbul to map back to TypeScript
         * and then generate coverage report.
         */
		coverageReporter: {
			dir: path.resolve(projectConfig.projectDist, 'reports/coverage'),
			reporters: [{
				type: 'json',
				subdir: '.',
				file: 'coverage-final.json'
			}]
		},

		// Configuration block for karma-junit-reporter
		junitReporter: {
			outputDir: path.resolve(projectConfig.projectDist, 'reports/tests'), // results will be saved as $outputDir/$browserName.xml
			outputFile: 'junit.xml', // if included, results will be saved as $outputDir/$browserName/$outputFile
			useBrowserName: false // add browser name to report and classes names
		},

		htmlReporter: {
			outputFile: path.resolve(projectConfig.projectDist, 'reports/tests/index.html'),
			pageTitle: 'Unit Tests',
			groupSuites: true,
			useCompactStyle: true
		},

		remapIstanbulReporter: {
			src: path.resolve(projectConfig.projectDist, 'reports/coverage/coverage-final.json'),
			reports: {
				lcovonly: path.resolve(projectConfig.projectDist, 'reports/coverage/lcov.info'),
				html: path.resolve(projectConfig.projectDist, 'reports/coverage/')
			},
			timeoutNotCreated: 1000, // default value
			timeoutNoMoreFiles: 1000 // default value
		},

		// Webpack please don't spam the console when running in karma!
		webpackMiddleware: {
			noInfo: true,
			stats: {
				chunks: false,
				colors: true
			}
		},

		/*
		 * test results reporter to use
		 *
		 * possible values: 'dots', 'progress'
		 * available reporters: https://npmjs.org/browse/keyword/karma-reporter
		 */
		reporters: ['mocha', 'coverage', 'html', 'junit', 'karma-remap-istanbul'],

		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		/*
		 * level of logging
		 * possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		 */
		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: false,

		/*
		 * start these browsers
		 * available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		 */
		browsers: [
			'PhantomJS'
		],

		/*
		 * Continuous Integration mode
		 * if true, Karma captures browsers, runs the tests and exits
		 */
		singleRun: true
	});

};
