'use strict';

import gulp from 'gulp';
import uglify from 'gulp-uglify';
import babel from 'gulp-babel';
import concat from 'gulp-concat';

gulp.task('build', () => {
    gulp.src('src/*.js')
      .pipe(babel({ presets: ['es2015'] }))
      .pipe(concat('proximity.js'))
      .pipe(gulp.dest('dist'))
      .pipe(uglify())
      .pipe(concat('proximity.min.js'))
      .pipe(gulp.dest('dist'));
});

gulp.task('default',['build']);