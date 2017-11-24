var gulp        = require('gulp'),
		sass        = require('gulp-sass'),
		less        = require('gulp-less'),
		browserSync = require('browser-sync'),
		concat      = require('gulp-concat'),
		uglify      = require('gulp-uglifyjs'),
		cssnano     = require('gulp-cssnano'),
		rename      = require('gulp-rename'),
		del 				= require('del'),
		imagemin    = require('gulp-imagemin'),
		pngquant    = require('imagemin-pngquant');
		autoprefixer= require('gulp-autoprefixer');
		
gulp.task('test',function () {
	console.log("Gulp is working now");
});

gulp.task('sass',function () {
	return gulp.src('app/sass/**/*.+(scss|sass)')
		.pipe(sass())
		.pipe(autoprefixer(['last 15 versions','> 1%', 'ie 8', 'ie 7'],{cascade: true}))
		.pipe(gulp.dest('app/css'))	
		.pipe(browserSync.reload({stream:true}))
});

gulp.task('less',function () {
	return gulp.src('app/less/**/*.less')
		.pipe(less())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({stream:true}));
})

gulp.task('scripts',function () {
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
		'app/libs/ajax/dist/ajax.min.js'])
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'));
})

gulp.task('css-libs',function () {
	return gulp.src('app/css/libs.css')
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('app/css'));
})

gulp.task('browser-sync',function () {
	browserSync({
		server:{
			baseDir: 'app'
		},
		notify: false
	});
});

gulp.task('img',function () {
 gulp.src('app/img/**/*')
 .pipe(imagemin({
 	interlaced: true,
 	progressive: true,
 	svgoPlugins: [{removeViewBox: false}],
 	use: [pngquant()]
 }))
 .pipe(gulp.dest('build/img'));
})

gulp.task('watch',['browser-sync','sass','less'],function () {
	gulp.watch('app/sass/**/*.+(scss|sass)',['sass']);
	gulp.watch('app/*.html',browserSync.reload)
	gulp.watch('app/js/**/*.js',browserSync.reload)
});

gulp.task('clear',function () {
	 return del.sync('build');
});
gulp.task('build',['clear','img','sass','less','scripts'],function () {
	var builtCss= gulp.src('app/css/**/*.css')
			.pipe(gulp.dest('build/css'));

	var builtFonts = gulp.src('app/fonts/**/*')
			.pipe(gulp.dest('build/fonts'));

	var builtJS = gulp.src('app/js/**/*')
			.pipe(gulp.dest('build/js'));

	var builtHtml = gulp.src('app/*.html')
			.pipe(gulp.dest('build'));

			console.log("Mission Complete!");
});