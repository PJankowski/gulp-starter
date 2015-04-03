var gulp		= require('gulp'),
	jslint		= require('gulp-jslint'),
	useref		= require('gulp-useref'),
	webserver	= require('gulp-webserver'),
	stylus		= require('gulp-stylus'),
	sourcemaps	= require('gulp-sourcemaps'),
	uglify		= require('gulp-uglify'),
	gulpIf 		= require('gulp-if');	

gulp.task('stylus', function (){
	gulp.src('./styles/*.styl')
		.pipe(sourcemaps.init())
		.pipe(stylus({
			compress: true
		}))
		.pipe(sourcemaps.write('./build/assets/js/'))
		.pipe(gulp.dest('./styles/main.css'));
});

gulp.task('jslint', function(){
	gulp.src('./js/**/*.js')
		.pipe(jslint({
			evil: true,
			nomen: true,
			globals: [],
			predef: [],
			reporter: 'default',
			errorsOnly: false
		}))
		.on('error', function (error){
			console.log(String(error));
		});
});

gulp.task('images', function (){
	gulp.src('./images/**/*')
		.pipe(gulp.dest('./build/assets/images/'));
});

gulp.task('html', ['stylus'], function (){
	var assets = useref.assets();

	return gulp.src('./*.html')
			.pipe(assets)
			.pipe(gulpIf('*.js', sourcemaps.init()))
			.pipe(gulpIf('*.js', uglify()))
			.pipe(gulpIf('*.js', sourcemaps.write('./build/assets/js/')))
			.pipe(assets.restore())
			.pipe(useref())
			.pipe(gulp.dist('build'));
});

gulp.task('serve', function (){
	gulp.src('/')
		.pipe(webserver({
			livereload: true,
			directoryListing: false,
			open: true
		}));
});

gulp.task('watch', function (){
	gulp.watch('./styles/**/*.styl', ['stylus']);
	gulp.watch('./js/**/*.js', ['jslint']);
});

gulp.task('serve', ['stylus', 'jslint', 'serve', 'watch']);

gulp.task('build', ['stylus', 'images', 'html']);