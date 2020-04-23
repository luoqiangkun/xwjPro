var gulp = require('gulp'),
	connect = require('gulp-connect'),
    autoprefixer = require('autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    rename = require("gulp-rename"),
    babel = require("gulp-babel"); 

gulp.task('server', function(){//配置热更新服务器
	connect.server({
		root: './',
		livereload: true,
		port: 8080
    });
});

gulp.task('html',done => {
    gulp.src('./*.html')
        .pipe(connect.reload());
    done();
});


// 定义任务，打包JS文件
gulp.task('js',done => {
    console.log( 'js' );
    gulp.src('src/js/**/*.js')
        .pipe(babel()) 
        .pipe(concat('index.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename({suffix:'.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(connect.reload());
    done();
 });

// 定义任务，编译 sass
gulp.task('sass', done => {
    gulp.src('src/scss/**/*.scss')
        .pipe(concat('index.css'))
        .pipe(sass({outputStyle:'compressed'}))
        .pipe(rename({suffix:'.min'}))
		.pipe(gulp.dest('dist/css'))
        .pipe(connect.reload());
    done();
});

gulp.task('watch',done => {
    gulp.watch('src/scss/**/*.scss',gulp.series('sass'));
    gulp.watch('src/js/**/*.js',gulp.series('js'));
    gulp.watch('./*.html',gulp.series('html'));
    done();
});


gulp.task('default', gulp.series('js','sass','watch','server'));