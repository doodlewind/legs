var PRODUCTION = false;
var HTML_EXT_NAME = 'html';
var PORT = 8000;
var PATH = {
    src: {
        sass: 'src/sass',
        js: 'src/js',
        img: 'src/image',
        html: 'src/html',
        scaffold: 'src/scaffold',
        test: 'src/test'
    },
    dest: {
        css: 'resource/css',
        js: 'resource/js',
        img: 'resource/image',
        html: 'resource/html'
    }
};


var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var cssnano = require('gulp-cssnano');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');
var gulpIf = require('gulp-if');
var changed = require('gulp-changed');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var fileInclude = require('gulp-file-include');
var del = require('del');
var runSequence = require('run-sequence');
var server = require('gulp-webserver');


gulp.task('new', function() {
    var name = process.argv[4];

    // html template
    gulp.src(PATH.src.scaffold + '/blank.html')
        .pipe(replace(/@@PAGE_NAME@@/g, name))
        .pipe(replace(/@@JS_SRC@@/g, PATH.src.js))
        .pipe(replace(/@@JS_DEST@@/g, PATH.dest.js))
        .pipe(rename(name + '.html'))
        .pipe(gulp.dest(PATH.src.html));

    // sass template
    gulp.src(PATH.src.scaffold + '/style.scss')
        .pipe(replace(/@@PAGE_NAME@@/g, name))
        .pipe(rename('style-' + name + '.scss'))
        .pipe(gulp.dest(PATH.src.sass));
    gulp.src(PATH.src.scaffold + '/_main.scss')
        .pipe(replace(/@@PAGE_NAME@@/g, name))
        .pipe(gulp.dest(PATH.src.sass + '/layout/' + name));

    // js template
    gulp.src(PATH.src.scaffold + '/main.js')
        .pipe(replace(/@@PAGE_NAME@@/g, name))
        .pipe(gulp.dest(PATH.src.js + '/' + name));

    // test template
    gulp.src(PATH.src.scaffold + '/test.js')
        .pipe(replace(/@@PAGE_NAME@@/g, name))
        .pipe(replace(/@@JS_SRC@@/g, PATH.src.js))
        .pipe(gulp.dest(PATH.src.test + '/' + name));
    gulp.src(PATH.src.scaffold + '/test.html')
        .pipe(replace(/@@PAGE_NAME@@/g, name))
        .pipe(gulp.dest(PATH.src.test + '/' + name));
});

gulp.task("build-css", function() {
    return sass(PATH.src.sass + '/*.scss',
        { stopOnError: false, style: 'expanded' })
        .on('error', sass.logError)
        .pipe(gulpIf(PRODUCTION, cssnano()))
        .pipe(gulp.dest(PATH.dest.css));
});

gulp.task('build-image', function() {
    return gulp.src(PATH.src.img + '/**/*')
        .pipe(changed(PATH.dest.img))
        .pipe(gulp.dest(PATH.dest.img));
});

gulp.task('copy-html', function() {
    return gulp.src('*.html')
        .pipe(changed(PATH.dest.html))
        .pipe(rename({extname: "." + HTML_EXT_NAME}))
        .pipe(gulp.dest(PATH.dest.html));
});

gulp.task('useref', function () {
    gulp.src(PATH.src.js +'/default/**/*')
        .pipe(gulpIf(PRODUCTION, uglify()))
        .pipe(changed(PATH.dest.js + '/default'))
        .pipe(gulp.dest(PATH.dest.js + '/default'));
    gulp.src(PATH.src.html + '/*.html')
        .pipe(fileInclude({
            prefix: '@@',
            basepath: PATH.src.html + '/partials',
            indent: true
        }))
        .pipe(useref({searchPath: './'}))
        .pipe(gulpIf(PRODUCTION, gulpIf('*.js', uglify())))
        .pipe(gulp.dest(''));
});

gulp.task('watch-html', function(callback) {
    return runSequence('useref', 'copy-html', callback);
});

gulp.task('watch', function () {
    runSequence('default', function() {
        gulp.watch('src/sass/**/*.scss', ['build-css']);
        gulp.watch('src/html/**/*.html', ['watch-html']);
        gulp.watch('src/js/**/*.js', ['useref']);
        gulp.watch('src/image/**/*', ['build-image']);
    });
});

gulp.task('clean', function() {
    return del([PATH.dest.css, PATH.dest.js, PATH.dest.img, '*.html']);
});

gulp.task('clean-cache', function() {
    return del(['*.html', '.sass-cache']);
});

gulp.task('server', function() {
    runSequence('watch', function() {
        gulp.src('')
            .pipe(server({
                port: PORT,
                livereload: false,
                directoryListing: true,
                open: false
            }));
    });
});

gulp.task('default', function() {
    runSequence('clean', ['build-css', 'build-image'], 'useref', 'copy-html');
});
