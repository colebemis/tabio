var gulp = require('gulp');

var stylus = require('gulp-stylus');
var nib = require('nib');
var minify = require('gulp-minify-css');

var paths = {
  stylus: './css/stylus/*.styl',
  css: './css/*.css'
}

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
