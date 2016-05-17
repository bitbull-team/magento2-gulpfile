var gulp = require('gulp'),
    gutil = require('gulp-util'),
    chalk = require('chalk'),
    less  = require('gulp-less-sourcemap'),
    clean = require('gulp-clean'),
    run = require('gulp-run'),

    themesConfig = require('./dev/tools/grunt/configs/themes');

var options = ((process.argv.slice(2))[1]).substring(2);

gulp.task('watch', function() {
    var theme = themesConfig[options];
    gulp.watch(['./vendor/' + theme.name + '/**/*.less'], ['css']);
});


gulp.task('css', function() {
    var theme = themesConfig[options];
    var filesToCompile = [];

    theme.files.forEach(function(file) {
        filesToCompile.push(
            './pub/static/' + theme.area + '/' + theme.name + '/' + theme.locale + '/' + file + '.' + theme.dsl
        );
    });

    return gulp
        .src(filesToCompile)
        .pipe(less().on('error', function (error) {
            gutil.log(chalk.red('Error compiling LESS: ' + error.message));
        }))
        .pipe(gulp.dest('./pub/static/' + theme.area + '/' + theme.name + '/' + theme.locale + '/css'))
        .pipe(gutil.buffer(function() {
            gutil.log(chalk.green('Successfully compiled LESS'));
        }));
});

gulp.task('build', function() {

    var theme = themesConfig[options];
    var cmd = 'bin/magento dev:source-theme:deploy --theme ' + theme.name + ' --locale ' + theme.locale;
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
