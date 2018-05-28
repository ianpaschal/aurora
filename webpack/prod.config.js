const Path = require( "path" );
const merge = require( "webpack-merge" );
const baseConfig = require( "./base.config.js" );
const UglifyJsPlugin = require( "uglifyjs-webpack-plugin" );

module.exports = merge( baseConfig, {
	output: {
		path: Path.resolve( __dirname, "../dist/" ),
		filename: "aurora.min.js"
	},
	plugins: [
		// Minify JS
		new UglifyJsPlugin({
			sourceMap: false,
			uglifyOptions: {
				compress: {
					drop_console: true,
				}
			}
		})
	]
});
