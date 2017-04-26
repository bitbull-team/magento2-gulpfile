var gulp  = require('gulp'),
    less  = require('gulp-less'),
    gutil = require('gulp-util'),
    chalk = require('chalk'),
    clean = require('gulp-clean'),
    run   = require('gulp-run'),

    themesConfig = require('./dev/tools/gulp/themes');

var options = ((process.argv.slice(2))[1]).substring(2);

gulp.task('watch',
    function() {

        var theme = themesConfig[options];

        theme.src.forEach(function(module) {
            gulp.watch([ module + '/**/*.less'], ['css']);
        });

});


/**
 * Less Cmpile Task.
 */

gulp.task('css', function() {

    /**
     * Files to compile in pub/static.
     */
    var theme = themesConfig[options];
    var filesToCompile = [];
    theme.files.forEach(function(file) {
        filesToCompile.push(
            theme.dest + '/' + theme.locale + '/' + file + '.' + theme.lang
        );
    });

    // TODO: compile different languages
    var cssDestination = theme.dest + '/' + theme.locale + '/css';

    return gulp
        .src(filesToCompile)
        .pipe(less().on('error', function (error) {
            gutil.log(chalk.red('Error compiling LESS: ' + error.message));
        }))
        .pipe(gulp.dest(cssDestination))
        .pipe(gutil.buffer(function() {
            gutil.log(chalk.green('Successfully compiled ' + theme.lang ));
        }));
});

/**
 * Clean Task.
 */

gulp.task('build', function() {

    var theme = themesConfig[options];
    var cmd = ‘bin/magento dev:source-theme:deploy --theme ’ + theme.vendor + ‘/’+ theme.name + ’ --locale ' + theme.locale;
    var folderToClean = [
        './pub/static/' + theme.area + '/' + theme.name + '/*',
        './var/view_preprocessed/*',
        './var/cache/*'
    ];

    return gulp.src(folderToClean, {read: false})
        .pipe(clean())
        .pipe(gutil.buffer(function() {
            gutil.log(chalk.green('Clean..'));
        }))
        .pipe(run(cmd))
        .pipe(gutil.buffer(function() {
            gutil.log(chalk.green('Successfully build ' + theme.name ));
        }));

});

gulp.task('default', ['watch']);
