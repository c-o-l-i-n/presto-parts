/* eslint-disable @typescript-eslint/no-var-requires */

const rules = require('./webpack.rules')
const plugins = require('./webpack.plugins')

rules.push({
	test: /\.scss$/,
	use: [
		{ loader: 'style-loader' },
		{ loader: 'css-loader' },
		{ loader: 'sass-loader' },
	],
})

module.exports = {
	target: 'electron-renderer',
	module: {
		rules,
	},
	plugins: plugins,
	resolve: {
		extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
	},
}
