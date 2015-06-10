var gulp = require('gulp');

var imagemin = require('gulp-imagemin');
var jsonminify = require('gulp-jsonminify');
var minifycss = require('gulp-minify-css');
var minifyhtml = require('gulp-minify-html');
var nib = require('nib');
var stylus = require('gulp-stylus');
var zip = require('gulp-zip');

var version = '1.0.6';

var paths = {
  html: './*.html',
  stylus: './css/*.styl',
  js: './js/*.js',
  json: 'manifest.json',
  img: './img/*.png',
  vendor: [
    './bower_components/angular/angular-csp.css',
    './bower_components/jquery/dist/jquery.min.js',
    './bower_components/angular/angular.min.js',
    './bower_components/Sortable/Sortable.min.js',
    './bower_components/Sortable/ng-sortable.js'
  ]
};

var dest = './dist';

gulp.task('html', function () {
  return gulp.src(paths.html)
    .pipe(minifyhtml())
    .pipe(gulp.dest(dest));
});

gulp.task('css', function () {
  return gulp.src(paths.stylus)
    .pipe(stylus({use: [nib()], errors: true}))
    .pipe(minifycss())
    .pipe(gulp.dest(dest));
});

gulp.task('js', function () {
  return gulp.src(paths.js)
    .pipe(gulp.dest(dest));
});

gulp.task('json', function () {
  return gulp.src(paths.json)
    .pipe(jsonminify())
    .pipe(gulp.dest(dest));
})

gulp.task('img', function () {
  return gulp.src(paths.img)
    .pipe(imagemin())
    .pipe(gulp.dest(dest + '/img'));
});

gulp.task('vendor', function () {
  return gulp.src(paths.vendor)
    .pipe(gulp.dest(dest + '/vendor'));
});

gulp.task('watch', function () {
  gulp.watch(paths.html, ['html']);
  gulp.watch(paths.stylus, ['css']);
  gulp.watch(paths.js, ['js']);
  gulp.watch(paths.json, ['json']);
  gulp.watch(paths.img, ['img']);
  gulp.watch(paths.vendor, ['vendor']);
})

gulp.task('build', ['watch', 'html', 'css', 'js', 'json', 'img', 'vendor']);

gulp.task('zip', function () {
  return gulp.src(dest + '/**')
    .pipe(zip('tabio-' + version + '.zip'))
    .pipe(gulp.dest('./'));
});

/*
gulp.task('stylus', function () {
  gulp.src(paths.stylus)
    .pipe(stylus({use: [nib()], errors: true}))
    .pipe(gulp.dest('./css'));
});

gulp.task('minify', function() {
  gulp.src(paths.css)
    .pipe(minify())
    .pipe(gulp.dest('./css'));
});

gulp.task('watch', function () {
  gulp.watch(paths.stylus, ['stylus']);
  gulp.watch(paths.css, ['minify']);
});

gulp.task('default', ['watch', 'stylus', 'minify']);
*/
