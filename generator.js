/**
 * generate html/sass/js/test in src path
 * $ gulp generate --name PAGE_NAME
 */

var gulp = require('gulp');
var rename = require('gulp-rename');
var replace = require('gulp-replace');

module.exports = {
    generate: function(name) {
        // html template
        gulp.src('src/scaffold/blank.html')
            .pipe(replace(/@@PAGE_NAME@@/g, name))
            .pipe(rename(name + '.html'))
            .pipe(gulp.dest('src/html'));

        // sass template
        gulp.src('src/scaffold/style.scss')
            .pipe(replace(/@@PAGE_NAME@@/g, name))
            .pipe(rename('style-' + name + '.scss'))
            .pipe(gulp.dest('src/sass'));
        gulp.src('src/scaffold/_layout.scss')
            .pipe(replace(/@@PAGE_NAME@@/g, name))
            .pipe(rename('_layout-' + name + '.scss'))
            .pipe(gulp.dest('src/sass/layout/'));
        gulp.src('src/scaffold/_main.scss')
            .pipe(replace(/@@PAGE_NAME@@/g, name))
            .pipe(gulp.dest('src/sass/layout/' + name));

        // js template
        gulp.src('src/scaffold/main.js')
            .pipe(replace(/@@PAGE_NAME@@/g, name))
            .pipe(gulp.dest('src/js/' + name));

        // test template
        gulp.src('src/scaffold/test.js')
            .pipe(replace(/@@PAGE_NAME@@/g, name))
            .pipe(gulp.dest('src/test/' + name));
        gulp.src('src/scaffold/test.html')
            .pipe(rename('index.html'))
            .pipe(replace(/@@PAGE_NAME@@/g, name))
            .pipe(gulp.dest('src/test/' + name));
    }
};