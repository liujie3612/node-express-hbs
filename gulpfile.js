var gulp = require('gulp'),
    watch = require('gulp-watch');
var browserSync = require('browser-sync');
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

gulp.task('watch', function() {
    watch(['bower_components/**/*.js',
        'bower_components/**/*.css',
        'public/**/*.*',
        'views/**/*.*'
    ], function(event) {
        browserSync.reload(event.path)
    });
});

gulp.task('serve', ['watch'], function() {
    browserSync.init({
        startPath: '/',
        files: "**",
        server: {
            baseDir: "/",
        }
    });
});

gulp.task('clean', function() {
    return gulp.src('dist', {
            read: false
        })
        .pipe(clean());
});

gulp.task('css', function() {
    return gulp.src('public/styles/**/*.css', { base: '.' })
        .pipe(csso())
        .pipe(gulp.dest('dist'))
})

gulp.task('js', function() {
    return gulp.src('public/scripts/**/*.js', { base: '.' })
        .pipe(uglify())
        .pipe(gulp.dest('dist'))
})

gulp.task('image', function() {
    return gulp.src('public/images/**/*.{svg,png,jpg}', { base: '.' })
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }]
        }))
        .pipe(gulp.dest('dist'))
})

gulp.task('font',  function(done) {
    var buffers = [];
    gulp
        .src(['app/index.html'])
        .on('data', function(file) {
            buffers.push(file.contents);
        })
        .on('end', function() {
            var text = Buffer.concat(buffers).toString('utf-8');
            gulp.src('public/fonts/fzltxh.ttf')
                .pipe(fontmin({
                    text: text
                }))
                .pipe(gulp.dest('dist/fonts'))
                .on('end', done)
        });
})

gulp.task('build', ['css', 'js', 'image', 'font'])
