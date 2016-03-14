var gulp = require('gulp');
var browsersync = require('browser-sync').create();
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var fontmin = require('gulp-fontmin');
var imagemin = require('gulp-imagemin');
var minifyCss = require('gulp-minify-css');
var usemin = require('gulp-usemin');
var csso = require('gulp-csso');
/*
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "app"
        }
    });
});*/

gulp.task('clean', function () {
    return gulp.src('dist/*', {
            read: false
        })
        .pipe(clean());
});

gulp.task('copy', function () {
    return gulp.src(['bower_components/**/*.*', 'views/**/*.html','README.md', 'config.js', 'app.js', 'bin/www', 'markdown-toc.js', 'marked.js', 'raneto.js', 'content/**/*', 'package.json', 'public/*.*', 'public/fonts/**/*.*', 'node_modules/**/*.*'], {
            base: '.',
            'buffer': false
        })
        .pipe(gulp.dest('dist'));
})


gulp.task('build', ['css', 'js', 'image', 'font']);
