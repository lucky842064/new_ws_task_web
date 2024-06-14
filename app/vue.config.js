const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Timestamp = new Date().getTime() + Math.random() * new Date().getMilliseconds();
const path = require('path');
const resolve = (dir) => path.join(__dirname, dir);

module.exports = {
	transpileDependencies: ['vuetify'],
	publicPath: process.env.NODE_ENV == 'development' ? './' : process.env.VUE_APP_STICURL, // 公共路径
	outputDir: process.env.outputDir,
	chainWebpack: config => {
		// if (process.env.NODE_ENV === 'production') {
		// 给js和css配置版本号
		config.output.filename(`${process.env.NODE_ENV === 'production' ? 'js/[name].[chunkhash].js' : 'js/[name].[hash].js'}`).end();
		config.output.chunkFilename(`${process.env.NODE_ENV === 'production' ? 'js/[name].[chunkhash].js' : 'js/[name].[hash].js'}`).end();

		config.module
			.rule('svg')
			.exclude.add(resolve('src/icons'))
			.end()
		config.module
			.rule('icons')
			.test(/\.svg$/)
			.include.add(resolve('src/icons'))
			.end()
			.use('svg-sprite-loader')
			.loader('svg-sprite-loader')
			.options({
				symbolId: 'icon-[name]'
			})
			.end()

		config
			.plugin('extract-css')
			.use(require('mini-css-extract-plugin'))
			.tap(args => [
				{
					filename: `${process.env.NODE_ENV === 'production' ? 'css/[name].[chunkhash].css' : 'css/[name].[hash].css'}`,
					chunkFilename: `${process.env.NODE_ENV === 'production' ? 'css/[name].[chunkhash].css' : 'css/[name].[hash].css'}`,
				},
			]);
		// }
	},
	configureWebpack: {
		// output: {
		//   filename: `js/[name].${Timestamp}.js`,
		//   chunkFilename: `js/[name].${Timestamp}.js`
		// },
		// plugins:[
		//   new TerserPlugin({
		//     terserOptions: {
		//       compress: {
		//         drop_console: true,
		//         drop_debugger: true,
		//       },
		//       except: ['$super', '$', 'exports', 'require'],
		//       mangle: false,
		//       output: {
		//         beautify: true,//压缩注释
		//       }
		//     },
		//     sourceMap: false,
		//     parallel: true,
		//   }),
		//   new MiniCssExtractPlugin({
		//     filename: `css/[name].${Timestamp}.css`,
		//     chunkFilename: `css/[name].${Timestamp}.css`
		//   })
		// ],
		externals: {
			vue: 'Vue',
			'vue-router': 'VueRouter',
			vuex: 'Vuex',
			axios: 'axios',
			vant: 'vant',
			'js-md5': 'md5',
			'vue-clipboard2': 'VueClipboard',
			moment: 'moment',
			'js-cookie': 'Cookies',
			'js-base64': 'Base64',
			'better-scroll': 'BScroll',
			html2canvas: 'html2canvas',
			'spark-md5': 'SparkMD5',
			'crypto-js': 'CryptoJs',
			'mobile-detect': 'MobileDetect',
		},
	},
	productionSourceMap: false,
	devServer: {
		// 配置服务器
		host: '0.0.0.0',
		port: 8080,
		open: false,
		https: false,
		overlay: {
			warnings: true,
			errors: true,
		},
	},
	css: {
		loaderOptions: {
			sass: {
				prependData: `@import "@/assets/styles/_variable.scss";`,
			},
			less: {
				modifyVars: {
					// 或者可以通过 less 文件覆盖（文件路径为绝对路径）
					hack: `true; @import "@/assets/styles/_theme.less";`,
				},
			},
			postcss: {
				plugins: [
					require('postcss-pxtorem')({
						rootValue: 100, // 换算的基数
						propList: ['*'],
						selectorBlackList: ['van', 'no-pxtorem'],
					}),
				],
			},
		},
	},
};
