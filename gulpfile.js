var gulp = require('gulp');
var source = require('vinyl-source-stream'); // Used to stream bundle for further handling
var browserify = require('browserify');
var watchify = require('watchify');
var mithrilify = require('mithrilify'); 
var concat = require('gulp-concat');

var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var gutil = require('gulp-util');

var errorLog = function(e) {
  return gutil.log("Error in line " + e.lineNumber + ":  \"" + e.description + "\"  [" + e.filename + "]");
};
 
gulp.task('app', function() {
  var bundler = browserify({
    entries: ['./src/app.js'], // Only need initial file, browserify finds the deps
    transform: [mithrilify], // We want to convert MSX to normal javascript
    debug: true, // Gives us sourcemapping
    cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
  });

  var watcher = watchify(bundler);

  return watcher
    .on('update', function () { // When any files update
        var updateStart = Date.now();

        watcher.bundle() // Create new bundle that uses the cache for high performance
          .on('error', errorLog)
          .pipe(source('app.js'))
          // This is where you add uglifying etc.
          .pipe(gulp.dest('./build/js'));

        console.log('Updated!', (Date.now() - updateStart) + 'ms');
    })
    .bundle() // Create the initial bundle when starting the task
    .on('error', errorLog)
    .pipe(source('app.js'))
    .pipe(gulp.dest('./build/js'));
});

gulp.task('login', function() {
  var bundler = browserify({
    entries: ['./src/Static/login.js'],
    transform: [mithrilify],
    debug: true, // Gives us sourcemapping
    cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
  });

  var watcher = watchify(bundler);

  return watcher
    .on('update', function () { // When any files update
        var updateStart = Date.now();

        watcher.bundle() // Create new bundle that uses the cache for high performance
          .on('error', errorLog)
          .pipe(source('login.js'))
          // This is where you add uglifying etc.
          .pipe(gulp.dest('./build/js'));

        console.log('LOGIN Updated!', (Date.now() - updateStart) + 'ms');
    })
    .bundle() // Create the initial bundle when starting the task
    .on('error', errorLog)
    .pipe(source('login.js'))
    .pipe(gulp.dest('./build/js'));
});

gulp.task('register', function() {
  var bundler = browserify({
    entries: ['./src/Static/register.js'],
    transform: [mithrilify],
    debug: true, // Gives us sourcemapping
    cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
  });

  var watcher = watchify(bundler);

  return watcher
    .on('update', function () { // When any files update
        var updateStart = Date.now();

        watcher.bundle() // Create new bundle that uses the cache for high performance
          .on('error', errorLog)
          .pipe(source('register.js'))
          // This is where you add uglifying etc.
          .pipe(gulp.dest('./build/js'));

        console.log('REGISTER Updated!', (Date.now() - updateStart) + 'ms');
    })
    .bundle() // Create the initial bundle when starting the task
    .on('error', errorLog)
    .pipe(source('register.js'))
    .pipe(gulp.dest('./build/js'));
});

// I added this so that you see how to run two watch tasks
gulp.task('styles', function() {
  gulp.src(['./src/**/*.scss'])
    .pipe(plumber())
    .pipe(sass())
    .pipe(rename({extname: '.css'}))
    .pipe(minifyCss())
    .pipe(concat('app.min.css'))
    .pipe(gulp.dest('./build/css'));

  gulp.watch(['./src/**/*.scss'], function() {
    console.log("updating styles!");
    
    return gulp.src(['./src/**/*.scss'])
      .pipe(plumber())
      .pipe(sass())
      .pipe(rename({extname: '.css'}))
      .pipe(minifyCss())
      .pipe(concat('app.min.css'))
      .pipe(gulp.dest('./build/css'));
  });
});

gulp.task('default', ['app', 'styles']);
gulp.task('static', ['login', 'register']);