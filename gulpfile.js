var gulp = require('gulp'),
    jshint = require('gulp-jshint')
    rename = require('gulp-rename')
    uglify = require('gulp-uglify');

gulp.task('compress', function() {
  gulp.src('src/*.js')
    .pipe(rename('proximity.js'))
    .pipe(gulp.dest('dist'))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist'))
});

gulp.task('lint', function() {
    return gulp.src(['src/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('default',['lint', 'compress']);