var path                    = require('path');
    gulp                    = require('gulp'),
    postcss                 = require('gulp-postcss'),
    header                  = require('gulp-header'),
    rename                  = require('gulp-rename'),
    newer                   = require('gulp-newer'),
    cssnext                 = require('postcss-cssnext'),
    postcssImport           = require('postcss-import'),
    postcssDiscardComments  = require('postcss-discard-comments'),
    browserSync             = require('browser-sync').create(),
    cssnano                 = require('cssnano');


gulp.task('serve', ['allCss'], function() {
    browserSync.init({
        server: "./"
    });

    gulp.watch("ui/**.reel/_*.css", ['css']);
    gulp.watch("ui/_*.css", ['allCss']);
    gulp.watch("ui/**/*.html").on('change', browserSync.reload);
});


gulp.task('css', function() {
    var processors = [
        postcssImport,
        cssnext,
        postcssDiscardComments,
        cssnano({autoprefixer: false})
    ];

    return gulp.src('ui/**.reel/_*.css')
        .pipe(rename(function(path) {
            path.basename = path.basename.substring(1);
        }))
        .pipe(newer({dest: './ui'}))
        .pipe(header("@import '../_config';"))

        .pipe(postcss(processors))
        .pipe(gulp.dest('./ui'))
        .pipe(browserSync.stream());
});

gulp.task('allCss', function() {
    var processors = [
        postcssImport,
        cssnext,
        postcssDiscardComments,
        cssnano({autoprefixer: false})
    ];

    return gulp.src('ui/**.reel/_*.css')
        .pipe(rename(function(path) {
            path.basename = path.basename.substring(1);
        }))
        .pipe(header("@import '../_config';"))

        .pipe(postcss(processors))
        .pipe(gulp.dest('./ui'))
        .pipe(browserSync.stream());
});

// Default task to be run with `gulp`
gulp.task('default', ['serve']);
