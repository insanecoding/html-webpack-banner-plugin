'use strict';

const HtmlWebpackPlugin = require('html-webpack-plugin');

const REGEX_DOCTYPE = /^<!doctype[^>]*?>/i;

class HtmlWebpackBannerPlugin {
	constructor(options) {
		this.options = options || {};
	}

	apply(compiler) {
		const banner = this.options.banner || '';
		const raw = this.options.raw;

		compiler.hooks.compilation.tap('HtmlWebpackBannerPlugin', compilation => {
			const hooks = HtmlWebpackPlugin.getHooks(compilation);

			hooks.afterTemplateExecution.tapAsync(
				'HtmlWebpackBannerPlugin',
				(htmlPluginData, cb) => {
					const comment = banner && !raw ? '<!--' + banner + '-->\n' : banner;
					const doctype = htmlPluginData.html.match(REGEX_DOCTYPE);

					if (typeof doctype != 'undefined') {
						htmlPluginData.html = htmlPluginData.html.replace(REGEX_DOCTYPE, `${doctype}${comment}`);
					} else {
						htmlPluginData.html = `${comment}${htmlPluginData.html}`;
					}

					cb(null, htmlPluginData);
				}
			);
		});
	}
}

module.exports = HtmlWebpackBannerPlugin;
