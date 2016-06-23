var path                    = require('path');
var gulp                    = require('gulp');
var postcss                 = require('gulp-postcss');
var header                  = require('gulp-header');
var rename                  = require('gulp-rename');
var cssnext                 = require('postcss-cssnext');
var postcssImport           = require('postcss-import');
var postcssDiscardComments  = require('postcss-discard-comments');
var browserSync             = require('browser-sync');

gulp.task('serve', ['css'], function() {

    browserSync.init({
        server: "./"
    });

    gulp.watch("ui/**/_*.css", ['css']);
    gulp.watch("ui/**/*.html").on('change', browserSync.reload);
});


gulp.task('css', function() {
    var processors = [
        postcssImport,
        cssnext,
        postcssDiscardComments
    ];

    return gulp.src('ui/**.reel/_*.css')
        .pipe(header("@import '../_config';"))

        .pipe(postcss(processors))
        .pipe(rename(function(path) {
            // path.basename = '_' + path.basename;
            path.basename = path.basename.substring(1);
        }))
        .pipe(gulp.dest('./ui'))
        .pipe(browserSync.stream());
});

// Default task to be run with `gulp`
gulp.task('default', ['serve']);
