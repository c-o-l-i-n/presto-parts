/* eslint-disable @typescript-eslint/no-var-requires */

const rules = require('./webpack.rules')
const plugins = require('./webpack.plugins')

module.exports = {
	module: {
		rules,
	},
	plugins: plugins,
	resolve: {
		extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
	},
	devtool: 'source-map',
}
