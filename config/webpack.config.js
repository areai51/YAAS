'use strict';

const path              = require('path');
const webpack           = require('webpack');
const webpackMerge      = require('webpack-merge'); // used to merge webpack configs
const parseuri          = require('parseuri');
const open              = require('open');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const projectConfig     = require('../project.config');

/**
 * Build the metadata object. This is an options object that is passed to the webpack build files
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

/**
 * We need to define the index.html file we want to load when doing a development build. This file will be served up
 * by webpack when performing a development build.
 *
 * @TODO: moved the path defination to 'project.config.js' file
 */
const indexHTML = path.join(projectConfig.projectSrc, 'index.html');

let projectWebpackConfig = {
	/**
	 * The base webpack config does not assume any entry points or bundles. You must add them here or nothing will be
	 * built. Use an array to pull in multiple entry points into a bundle. The bundles configured here are defaults and
	 * should probably be changed on a per-project basis. Please follow webpack configuration documentation.
	 */
	entry: {
		'app': ['./src/main.ts'],
		'vendor': ['./src/vendor.ts'],
		'polyfills': ['./src/polyfills.ts']
	},

	/**
	 * The base webpack config does not assume any output options. You must configure your output if you want the output
	 * to be directed to a specific location. This should probably be changed on a per-project basis. Please follow
	 * webpack configuration documentation.
	 */
	output: {
		path: projectConfig.projectDist,
		publicPath: '/',
		filename: '[name].js',
		chunkFilename: '[id].chunk.js'
	},

	module: {
		loaders: [
			/**
			 * Html loader support for *.html
			 * Returns file content as string, and minimizing the HTML when required.
			 *
			 * This cannot be included in the common webpack configuration because we need to add
			 * an exclude when we are using the HTMLWebpackPlugin.
			 *
			 * See: https://github.com/webpack/html-loader
			 */
			{
				test: /\.html$/,
				loader: 'html',
				exclude: [indexHTML]
			}
		]
	},

	/**
	 * The base webpack config adds the below plugins. If you would like to add more, like the commons chunk plugin, you
	 * will need to define them here.
	 *
	 * Dev Plugins are:
	 * new DefinePlugin(metadata),
	 * new ProgressBarPlugin({
	 *   format: 'build [:bar] :percent (:elapsed seconds): :msg'
	 * }),
	 * new ForkCheckerPlugin(),
	 * new webpack.optimize.OccurenceOrderPlugin(true),
	 *
	 * Prod Plugins are:
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
		// Create a commons chunk from the chunks listed
		new webpack.optimize.CommonsChunkPlugin({
			name: ['app', 'vendor', 'polyfills']
		}),

		/**
		 * Plugin: HtmlWebpackPlugin
		 * Description: Host an index.html file. Important for local builds when using webpack dev server.
		 * This can stay here even for prod builds.
		 *
         * This plugin simplifies generation of `index.html` file. Especially useful for production environment,
         * where your files have hashes in their names.
         *
         * We have auto-injection disabled here, otherwise scripts will be automatically inserted at the end
         * of `body` element.
         *
         * See https://www.npmjs.com/package/html-webpack-plugin.
         *
         * @TODO: Google Analytics and other stuff like that
         */
		new HtmlWebpackPlugin({
			template: indexHTML,
			chunksSortMode: 'dependency'
		}),

		/**
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
		}])
	]
};

/**
 * Work in Progress, not completed, not tested.
 * Uses: help to set-up proxies for urls to use in local server for development.
 * Note: proxy url, headers, and other properties are probably be changed on a per-project basis.
 */
if (buildEnvironment.api_endpoint && (baseWebpackConfig.devServer || projectWebpackConfig.devServer)) {
	projectWebpackConfig.devServer.proxy = {
		'/api*': {
			'target': buildEnvironment.api_endpoint,
			'host': parseuri(buildEnvironment.api_endpoint).host,
			'secure': false,
			'headers': {
				'Authorization': 'Basic dm1sZ3Vlc3Q6Q3JlYXRpdml0eTIwMTE='
			}
		}
	};
}

if (buildEnvironment.open) {
	setTimeout(function() {
		open(`http://${buildEnvironment.host || 'localhost'}:${buildEnvironment.port || '8080'}`);
	}, 300);
}

// Compile the webpack config and print to console for debugging purposes
const compiledConfig = webpackMerge.smart(baseWebpackConfig, projectWebpackConfig);
console.log('Webpack Configuration:');
// console.log(JSON.stringify(compiledConfig, null, 2));

module.exports = compiledConfig;
