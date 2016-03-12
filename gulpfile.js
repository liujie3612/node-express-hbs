var gulp = require('gulp');
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



gulp.task('build', ['css', 'js', 'image', 'font']);
