var gulp = require('gulp');
var server = require('gulp-develop-server');
var bs = require('browser-sync').create();

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

var options = {
    server: {
        path: './bin/www',
        execArgv: ['--harmony']
    },
    bs: {
        proxy: {
            target: 'http://localhost:9000',
            middleware: function(req, res, next) {
                next();
            }
        },
    }
};

var serverFiles = [
    './app/public/styles/*',
    './app/public/images/*',
    './app/routes/*.js',
    './app/views/*'
];

gulp.task('server:start', function() {
    server.listen(options.server, function(error) {
        if (!error)
            bs.init(options.bs);
    });
});

gulp.task('server:restart', function() {
    server.restart(function(error) {
        if (!error) bs.reload();
    });
});

gulp.task('server', ['server:start'], function() {
    gulp.watch(serverFiles, ['server:restart'])
});

// gulp.task('build', ['clean','copy','css', 'js', 'image', 'font']);
