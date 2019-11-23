/**
 * Wrap gulp streams into fail-safe function for better error reporting
 * Usage:
 * gulp.task('less', wrapPipe(function(success, error) {
 *   return gulp.src('less/*.less')
 *      .pipe(less().on('error', error))
 *      .pipe(gulp.dest('app/css'));
 * }));
 *
 * @author just-boris
 * @url    https://gist.github.com/just-boris/89ee7c1829e87e2db04c
 *
 * @param taskFn
 * @returns {Function}
 */
function wrapPipe(taskFn) {
    return async function(done) {
        var onSuccess = function() {
            done();
        };
        var onError = function(err) {
            done(err);
        }
        var outStream = taskFn(onSuccess, onError);
        if (outStream && typeof outStream.on === 'function') {
            outStream.on('end', onSuccess);
        }
    }
}

/**
 * Array of host scripts to be watched & concatenated.
 * @returns {string[]}
 */
function getHostScripts() {
    return [
        '!host/host.all.jsx',
        'host/polyfills.js',
        'host/JSON.jsx',
        'host/Logger.jsx',
        'host/Helpers.jsx',
        'host/SelectionDimensions.jsx',
        'host/Utils.jsx',
        'host/SettingsDialog.jsx',
        'host/globals.js',
        'host/ErrorClasses.jsx',
        'host/index.jsx',
        'testing/host.jsx'
    ];
}

/**
 * Array of client scripts to be watched & concatenated.
 * NOTE : Does not include 'client/index.js' intentionally because it
 * needs to be loaded last in the HTML file.
 * @returns {string[]}
 */
function getClientScripts() {
    return [
        '!client/client.all.js',
        'client/lib/jquery-3.3.1.min.js',
        'host/polyfills.js',
        'host/ErrorClasses.jsx',
        'client/lib/JSX.js',
        'client/lib/CSInterface.js',
        'host/globals.js',
        'client/lib/UserSettings.js',
        'client/lib/b64toblob.js',
        'host/Helpers.jsx',
        'client/lib/FlyoutMenu.js',
        'client/lib/AccountDetails.js',
        'client/lib/functions.js'
    ];
}

/**
 * Array of stylesheets to be watched & concatenated.
 * @returns {string[]}
 */
function getStylesheets() {
    return [
        '!client/theme/css/client.all.css',
        'client/theme/css/topcoat-0.8.0/css/topcoat-desktop-dark.min.css',
        'client/theme/css/icons-0.2.0/font/icomatic.css',
        'client/theme/css/progress.css',
        'client/theme/css/style.css'
    ];
}

/**
 * Array of test scripts to be watched & concatenated.
 * @returns {string[]}
 */
function getTestingScripts() {
    return [
        'testing/client.js',
        'testing/host.jsx'
    ]
}

/**
 * Array of HTML files to be watched.
 * @returns {string[]}
 */
function getHtmlFiles() {
    return [
        'client/index.html'
    ]
}

/**
 * @url http://markgoodyear.com/2014/01/getting-started-with-gulp/
 * @type {*|Gulp}
 */
var gulp         = require('gulp'),
    replace      = require('gulp-string-replace'),
    concat       = require('gulp-concat'),
    cleancss     = require('gulp-clean-css')

/**
 * watch task
 */
gulp.task('watch', wrapPipe(function(success, error) {

    gulp.watch(Array.prototype.concat(
        ['client/index.js'],
        getTestingScripts(),
        getHostScripts(),
        getClientScripts(),
        getStylesheets(),
        getHtmlFiles()
    ), gulp.series('build')).on('error', error);
}));

/**
 * Build host scripts.
 */
gulp.task('host', wrapPipe(function(success, error) {

    return gulp.src(getHostScripts())
        .pipe(concat('host.all.jsx').on('error', error))
        .pipe(gulp.dest('host'));

}));

/**
 * Build client scripts.
 */
gulp.task('client', wrapPipe(function(success, error) {

    return gulp.src(getClientScripts())
        .pipe(concat('client.all.js').on('error', error))
        .pipe(gulp.dest('client'));
}));

/**
 * Build styles.
 */
gulp.task('styles', wrapPipe(function(success, error) {

    return gulp.src(getStylesheets())
        .pipe(concat('client.all.css').on('error', error))
        .pipe(replace('../img/',               'topcoat-0.8.0/img/'))
        .pipe(replace('../font/',              'topcoat-0.8.0/font/'))
        .pipe(replace('icomatic.eot',          'css/icons-0.2.0/font/icomatic.eot'))
        .pipe(replace('icomatic.woff',         'icons-0.2.0/font/icomatic.woff'))
        .pipe(replace('icomatic.ttf',          'icons-0.2.0/font/icomatic.ttf'))
        .pipe(replace('icomatic.svg#icomatic', 'icons-0.2.0/font/icomatic.svg#icomatic'))
        .pipe(cleancss())
        .pipe(gulp.dest('client/theme/css/'));
}));

/**
 * default task
 */
gulp.task('default', gulp.series('watch'));

/**
 * Build all task
 */
gulp.task('build', gulp.series(['host', 'client', 'styles']));
