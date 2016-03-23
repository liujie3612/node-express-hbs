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
var notify = require('gulp-notify');
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
    './app/views/**/*',
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

gulp.task('clean', function() {
    return gulp.src(['dist/styles', 'dist/scripts', 'dist/images'], { read: false })
        .pipe(clean());
});


gulp.task('styles', ['clean'], function() {
    return gulp.src('app/public/styles/**/*.css', {
            base: 'app'
        }) //引入所有CSS
        .pipe(concat('main.css')) //合并CSS文件
        .pipe(rename({ suffix: '.min' })) //重命名
        .pipe(minifyCss()) //CSS压缩
        .pipe(gulp.dest('dist/styles')) //压缩版输出
        .pipe(notify({ message: '样式文件处理完成' }));
});

gulp.task('scripts', ['clean'], function() {
    return gulp.src('app/public/scripts/**/*.js', {
            base: 'app'
        }) //引入所有需处理的JS
        .pipe(concat('main.js')) //合并JS文件
        .pipe(rename({ suffix: '.min' })) //重命名
        .pipe(uglify()) //压缩JS
        .pipe(gulp.dest('dist/scripts')) //压缩版输出
        .pipe(notify({ message: 'JS文件处理完成' }));
});

// 图片处理任务
gulp.task('images', ['clean'], function() {
    return gulp.src('app/public/images/**/*.{svg,png,jpg,gif}', {
            base: 'app/public/images'
        }) //引入所有需处理的图片
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }]
        }))
    .pipe(gulp.dest('dist/images'));
    // .pipe(notify({ message: '图片处理完成' }));
});

gulp.task('serve', ['server:start'], function() {
    gulp.watch(serverFiles, ['server:restart'])
});

gulp.task('build', ['clean', 'styles', 'scripts', 'images']);
