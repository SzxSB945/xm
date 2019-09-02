// Global setting

// 忽略的文件
var ignoreFiles = [
	'form-builder/**', 'table-builder/**', 'test**', 'Web.config',
	'vwd.webinfo', 'package.json', 'package-lock.json', 'demo.css',
	'demo_index.html', 'template.html', 'fis-conf.js', 'interface.json',
	'mock/**', '_manage_tool.html', '_manage_tool.js', '**副本**',
	'static/**'
];

// 构建到/static/lib.js的文件
var packagedJs = [
	'/js/lib/es5-shim.js',
	'/js/lib/localStorage/localStorage.min.js?swfURL=/js/lib/localStorage/localStorage.swf',
	'/js/lib/jquery.min.js',
	'/js/lib/avalon.js',
	'/js/lib/template-web.min.js',
	'/js/lib/crypto-js/crypto-js.js',
	'/js/lib/bootstrap.min.js',
	'/js/lib/bootstrap-table/bootstrap-table.min.js',
	'/js/lib/bootstrap-table/bootstrap-table-locale-all.min.js',
	'/js/lib/layer/layer.min.js',
	'/js/lib/laydate/laydate.min.js',
	'/js/lib/jquery.i18n.properties.js',
	'/js/lib/js.cookie.js',
	'/js/lib/mousetrap.min.js',
	'/js/lib/moment.min.js',
	'/js/lib/xml2json.js',
	'/js/lib/keyboard/keyboard.js',
	'/js/lib/jquery.nicescroll/jquery.nicescroll.min.js',
	'/js/lib/countUp.withPolyfill.min.js',
	'/js/library.js',
	'/js/interface.js',
	//'/js/loadcss.js',
	'/js/lang.js',
	'/js/error-mapping.js',
	'/js/plugins/plugin-loader.js',
	'/js/plugins/*/**.js',
	'/modules/table/js/table-render.js',
	'/js/auth.js',
	'/js/app-init.js'
];

// 构建到/static/lib.css的文件
var packagedCss = [
	'/css/bootstrap.min.css',
	'/fonts/iconfont.css',
	'/js/lib/laydate/theme/default/laydate.css',
	'/js/lib/layer/theme/default/layer.css',
	'/js/lib/keyboard/keyboard.css',
	'/css/global.css',
	'/js/plugins/plugin.css'
];

// for(var i = 0; i < packagedJs.length; i++) {
// 	ignoreFiles.push(packagedJs[i]);
// }

// for(var i = 0; i < packagedCss.length; i++) {
// 	ignoreFiles.push(packagedCss[i]);
// }

fis.set('project.ignore', ignoreFiles);

// Global start
fis.match('*.{js,css}', {
	useHash: true
});

fis.match('::image', {
	useHash: true
});

fis.match('*.html', {
	optimizer: fis.plugin('html-compress')
});

fis.match('*.js', {
	optimizer: fis.plugin('uglify-js')
});

fis.match('*.css', {
	optimizer: fis.plugin('clean-css'),
	useSprite: true
});

fis.match('*.png', {
	optimizer: fis.plugin('png-compressor')
});

fis.match('::package', {
	spriter: fis.plugin('csssprites'),
	packager: fis.plugin('map', {
		// 全局的js文件整合到一个文件中
		'/static/lib.js': packagedJs,
		// 全局的样式文件整合到一个文件中
		'/static/lib.css': packagedCss
	})
});
// Global end

// default media is `dev`
fis.media('dev')
	.match('*', {
		useHash: false,
		optimizer: null
	});

// 静态文件的版本，防止缓存用
var webFileVersion = new Date().getTime();

// 添加时间戳
fis.match('*.{js,css,png}', {
	query: '?' + webFileVersion
});

// extends GLOBAL config
fis.media('production')
	.match('*', {
		useHash: false,
		deploy: [
			// js文件加入时间戳
			fis.plugin('replace', {
				from: /\.queueScript\("(.+?\.js)"\)/g,
				to: function ($0, $1) {
					return '.queueScript("' + $1 + '?' + webFileVersion +'")';
				}
			}),

			// 加入时间戳
			fis.plugin('replace', {
				from: /__TIMESTAMP__/g,
				to: function () {
					return webFileVersion;
				}
			}),
			
			fis.plugin('local-deliver')
		]
	});