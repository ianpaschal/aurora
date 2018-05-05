const Path = require( "path" );
const merge = require( "webpack-merge" );
const baseConfig = require( "./base.config.js" );

module.exports = merge( baseConfig, {
	watch: true,
	output: {
		path: Path.resolve( __dirname, "../dist/" ),
		filename: "aurora.js"
	}
});
