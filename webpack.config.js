const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const sourceFolder = "./source",
	sourcePath = path.resolve(__dirname, sourceFolder),
	destinationPath = path.resolve(__dirname, "game");

module.exports = {
    mode: "development",
	context: path.resolve(__dirname),
	entry: {
		index: `${sourceFolder}/index.tsx`,
	},
	output: {
		filename: "js/[name].js",
		path: destinationPath,
	},
	plugins: [
		new HtmlWebpackPlugin({
			inject: true,
			template: `${sourceFolder}/index.html`
		}),
	],
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".jsx", ".png", ".jpg"],
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				vendors: {
					test: /[\\/]node_modules[\\/]/,
					name: "vendors",
					enforce: true,
					chunks: "all",
				},
			},
		},
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				include: [sourcePath],
				loader: ["ts-loader"],
			},
			{
				test: /PlayFabClientApi\.js$/,
				use: [ "script-loader" ]
			  }
		],
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				include: [sourcePath],
				loader: ["ts-loader"],
			},
			{
				test: /PlayFabAdminApi\.js$/,
				use: [ "script-loader" ]
			  }
		],
	},
};