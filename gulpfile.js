var gulp  = require('gulp'),
    less  = require('gulp-less'),
    gutil = require('gulp-util'),
    chalk = require('chalk'),
    clean = require('gulp-clean'),
    run   = require('gulp-run'),
    sourcemap = require('gulp-sourcemaps'),
    themesConfig = require('./dev/tools/gulp/themes');

var options = ((process.argv.slice(2))[1]).substring(2);

/**
 * Watch task
 */

gulp.task('watch',
    function() {
        var theme = themesConfig[options];
        theme.src.forEach(function(module) {
            gulp.watch([ module + '/**/*.less'], ['css']);
        });

    });


/**
 * Less Compile Task.
 */

gulp.task('css', function() {

    var theme = themesConfig[options],
        filesToCompile = [];
    theme.files.forEach(function(file) {
        filesToCompile.push(
            theme.dest + '/' + theme.locale + '/' + file + '.' + theme.lang
        );
    });

    var cssDestination = theme.dest + '/' + theme.locale + '/css';

    return gulp
        .src(filesToCompile)
        .pipe(sourcemap.init())
        .pipe(less().on('error', function (error) {
            gutil.log(chalk.red('Error compiling LESS: ' + error.message));
        }))
        .pipe(sourcemap.write())
        .pipe(gulp.dest(cssDestination))
        .pipe(gutil.buffer(function() {
            gutil.log(chalk.green('Successfully compiled ' + theme.lang ));
        }));
});

/**
 * Clean Task.
 */

gulp.task('clean', function() {

    var theme = themesConfig[options],
        createAlias  = 'bin/magento dev:source-theme:deploy --theme ' + theme.vendor + '/'+ theme.name + ' --locale ' + theme.locale,
        staticAssetDeploy = 'bin/magento setup:static-content:deploy -f',
        staticFolder = 'pub/static/' + theme.area + '/' + theme.vendor + '/' + theme.name;

    var folderToClean = [
        './' + staticFolder + '/*',
        './var/view_preprocessed/*'
    ];

    return gulp.src(folderToClean, {read: false})
        .pipe(clean())
        .pipe(gutil.buffer(function() {
            gutil.log(chalk.green('Clean ' + staticFolder));
            gutil.log(chalk.green('Clean preprocessed files'));
        }))
        .pipe(run(createAlias))
        .pipe(gutil.buffer(function() {
            gutil.log(chalk.green('Asset static deployment is starting. Wait...'));
        }))
        .pipe(run(staticAssetDeploy))
        .pipe(gutil.buffer(function() {
            gutil.log(chalk.green('Finished! now run "gulp watch --[your theme name]"'));
        }));

});

gulp.task('clean-cache', function() {

    var folderToClean = [
        './var/page_cache/*',
        './var/cache/*'
    ];

    return gulp.src(folderToClean, {read: false})
        .pipe(clean())
        .pipe(gutil.buffer(function() {
           gutil.log(chalk.green('Cache cleaned'));
         }))
});


gulp.task('default', ['watch']);
