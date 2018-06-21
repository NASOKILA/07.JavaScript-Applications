
//Tuk si zarejdame bibliotekite kato moduli
let gulp = require('gulp');
let concat = require('gulp-concat');
let uglify = require('gulp-uglify');
let eslint = require('gulp-eslint');

//i mu kazvame kakvo da izpulnqva
gulp.task('default', () => {
    return gulp.src(['js/module.js', 'js/app.js'])
        .pipe(eslint())
        .pipe(eslint.format()) // To display linting errors
        .pipe(eslint.failAfterError()) // To stop if any lint error occurs
        .pipe(concat('bundle.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/'));
});

//MOJEM DA IMAME MNOGO TASKOVE

//Gulpa vzima failove i gi prevrushta v edin stream koito da izprati na razlichni funkcii. 





