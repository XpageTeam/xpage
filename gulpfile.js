"use strict";

const $ = require("gulp-load-plugins")(),
	gulp = require("gulp"),
	browserSync = require("browser-sync").create(),
	gutil = require("gulp-util"),
	sourcemaps = require("gulp-sourcemaps"),
	ftp = require("vinyl-ftp");

let process = require("child_process"),
	connectionSettings = require("./accesses/accesses.js");

const templatePath = connectionSettings.server.path;
const remotePathCss = templatePath+"css",
	remotePathJs = templatePath+"js",
	remotePathImg = templatePath+"img";

const xpager_conn = ftp.create({
	host:      connectionSettings.xpager.host,
	user:      connectionSettings.xpager.user,
	password:  connectionSettings.xpager.password,
	parallel: 4,
	log: gutil.log
});


const server_conn = ftp.create({
	host:      connectionSettings.server.host,
	user:      connectionSettings.server.user,
	password:  connectionSettings.server.password,
	parallel: 4,
	log: gutil.log
});



gulp.task('browser-sync', () =>  {
	browserSync.init({
		server: {
			baseDir: 'docs'
		},
		notify: false
	});

	browserSync.watch([
		"docs/css/*.css",
		"docs/js/**/*.js",
		"docs/*.html",
	]).on("change", browserSync.reload);
});

gulp.task("postcss", _ => 
	gulp.src([
			"src/sss/main.sss"
		])
		.pipe(sourcemaps.init())
		.pipe($.postcss([
			require("postcss-import"),
			require('postcss-functions')({
				functions: require("./config/postcss/functions.js")
			}),
			require("postcss-short"),
			require("postcss-preset-env")({
				stage: 0
			}),
			require("postcss-assets"),
			require("postcss-flexbugs-fixes"),
			require("postcss-nesting"),
			require("postcss-nested"),
			require("postcss-font-magician")(require("./config/postcss/fonts.js")),
			require("cssnano"),
		], {parser: require("sugarss")})).on("error", $.notify.onError())
		.pipe($.rename(path => {
			path.extname = path.extname == ".sss" ? ".css" : path.extname;
		}))
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest("docs/css"))
);

gulp.task("pug", _ => 
	gulp.src("src/pug/*.pug")
		.pipe($.pug({pretty: true}))
		.pipe(gulp.dest("docs"))
);

gulp.task("move:fonts", _ => 
	gulp.src("src/fonts/**/*")
		.pipe(gulp.dest("docs/fonts"))
);

gulp.task("move:files", _ =>
	gulp.src("src/files/**/*")
		.pipe(gulp.dest("docs/files"))
);

gulp.task('imagemin', () =>  
	gulp.src([
			'src/img/**/*',
			], {since: gulp.lastRun("imagemin")})
		 .pipe($.cache($.imagemin([
				$.imagemin.jpegtran({
					progressive: true,
				}),
				require("imagemin-jpeg-recompress")({
					loops: 2,
					min: 80,
					max: 90,
					quality: "high"
				}),
				$.imagemin.svgo(),
				$.imagemin.optipng({optimizationLevel: 2}),
			//   require("imagemin-pngquant")({quality: '75-85', speed: 5})
			],{
	     		verbose: true
	    	})
		 ))
		.pipe(gulp.dest('docs/img'))
);


gulp.task("deploy:css", () => 
	gulp.src("docs/css/*.*", {since: gulp.lastRun("postcss")})
		.pipe(server_conn.dest(remotePathCss))
);

gulp.task("deploy:js", () => 
	gulp.src("docs/js/*.*", {since: gulp.lastRun("deploy:js")})
		.pipe(server_conn.dest(remotePathJs))
);

gulp.task("deploy:img", () => 
	gulp.src("docs/img/**/*", {since: gulp.lastRun("deploy:img")})
		.pipe(server_conn.dest(remotePathImg))
);

gulp.task("deploy:docs", _ => 
	gulp.src("docs/**/*.*", {buffer: false})
		.pipe(xpager_conn.dest(connectionSettings.xpager.dirName))
);

gulp.task("deploy", gulp.series(gulp.parallel("postcss", "pug", "imagemin"), "deploy:docs"));



const local = _ => {
	gulp.watch(["src/sss/**/*.sss"], gulp.series("postcss"));
	gulp.watch('src/pug/**/*', gulp.series("pug"));
	gulp.watch("src/img/**/*", gulp.series("imagemin"));
},
localWebpack = () => {
	process.exec("npm run localWatch");
},
watch = _ => {
	gulp.watch("docs/css/**/*", gulp.series("deploy:css"));
	gulp.watch("docs/js/*.js", gulp.series("deploy:js"));
	gulp.watch("docs/img/**/*", gulp.series("deploy:img"));
},
remoteWebpack = () => {
	process.exec("npm run remoteWatch");
};

gulp.task("deploy-to-server", gulp.series(gulp.parallel("postcss", "pug", "imagemin", "move:files"), gulp.parallel(local, remoteWebpack, watch)));

gulp.task("finish:him", gulp.series(gulp.parallel("postcss", "imagemin", "move:files"), gulp.parallel("deploy:css", "deploy:js")));

gulp.task("default", gulp.series(gulp.parallel("postcss", "pug", "imagemin", "move:fonts", "move:files"), gulp.parallel(local, localWebpack, "browser-sync")))

gulp.task('clearcache', (callback) => { $.cache.clearAll(); callback();});