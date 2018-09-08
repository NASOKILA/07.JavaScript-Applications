
let gulp = require('gulp');
let concat = require('gulp-concat');
let uglify = require('gulp-uglify');
let eslint = require('gulp-eslint');

gulp.task('default', () => {
    return gulp.src(['js/module.js', 'js/app.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .pipe(concat('bundle.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/'));
});
