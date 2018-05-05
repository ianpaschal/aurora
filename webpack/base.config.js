const Webpack = require( "webpack" );

module.exports = {
	target: "node",
	node: {
		__dirname: true,
		__filename: true,
	},
	entry: {
		main: "./src/index.js",
	},
	module: {
		loaders: [
			{
				test: /\.vue$/,
				loader: "vue-loader"
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				loader: "file-loader",
				query: {
					name: "[name].[ext]?[hash]"
				}
			}
		]
	},
	resolve: {
		alias: { vue: "vue/dist/vue.common.js" }
	},
	plugins: [
		new Webpack.EnvironmentPlugin( [
			"NODE_ENV",
		] ),
		new Webpack.IgnorePlugin( /uws/ )
	],
};
