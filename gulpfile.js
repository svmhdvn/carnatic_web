var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var msx = require('gulp-msx');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');

var paths = {
  scripts: ['./src/models/*.js', './src/*/*.js', './src/app.js'],
  styles: './src/**/*.scss'
}

gulp.task('default', ['styles', 'scripts', 'watch']);

gulp.task('styles', function(done) {
  gulp.src(paths.styles)
    .pipe(plumber())
    .pipe(sass())
    .pipe(rename({extname: '.css'}))
    .pipe(minifyCss())
    .pipe(concat('app.min.css'))
    .pipe(gulp.dest('./build/css'))
    .on('end', done);
});

gulp.task('scripts', function(done) {
  gulp.src(paths.scripts)
    .pipe(plumber())
    .pipe(msx())
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./build/js'))
    .on('end', done)
})

gulp.task('build', function(done) {
  gulp.src(paths.scripts)
    .pipe(msx())
    .pipe(uglify())
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest('./build/js'))
    .on('end', done)
})

gulp.task('watch', function() {
  gulp.watch(paths.styles, ['styles'])
  gulp.watch(paths.scripts, ['scripts'])
});