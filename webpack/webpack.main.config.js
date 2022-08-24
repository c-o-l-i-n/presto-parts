module.exports = {
	/**
	 * This is the main entry point for the application, it's the first file
	 * that runs in the main process.
	 */
	entry: './src/main/main.ts',
	target: 'electron-main',
	module: {
		rules: require('./webpack.rules'),
	},
	resolve: {
		extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
	},
}
