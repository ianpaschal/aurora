module.exports = function( grunt ) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON( "package.json" ),
		jsdoc : {
			dist : {
				src: [ "src/**/*.js", "README.md" ],
				options: {
					"destination": "./docs/",
					"encoding": "utf8",
					"private": true,
					"recurse": true,
					"template": "./node_modules/minami"
				}
			}
		},
		eslint: {
			options: {
				configFile: ".eslintrc.js",
				fix: true
			},
			target: [ "src/**/*.js", "!src/windows/**", "!docs" ]
		}
	});

	// Load tasks:
	require( "load-grunt-tasks" )( grunt );

	// Default task(s).
	grunt.registerTask( "default", [ "eslint", "jsdoc" ] );

};
