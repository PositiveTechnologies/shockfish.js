/* eslint-disable dot-location, no-process-exit */
'use strict';

const fs = require('fs'),
    gulp = require('gulp'),
    casper = require('gulp-casperjs-local').default,
    runSequence = require('run-sequence'),
    eslint = require('gulp-eslint'),
    rename = require('gulp-rename'),
    htmlbuild = require('gulp-htmlbuild'),
    connect = require('gulp-connect'),
    template = require('gulp-template'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    merge = require('merge-stream'),
    clean = require('gulp-clean'),
    addsrc = require('gulp-add-src'),
    iife = require('gulp-iife'),
    path = require('path'),
    addShockfishConfig = require('./tasks/gulp-add-shockfish-config.js');

// Project paths.
const BUILD_PATH = path.join(__dirname, '/build/');
const SRC_PATH = path.join(__dirname, '/src');
const CONFIG_PATH = path.join(__dirname, '/fixtures/', 'defaultConfig.json');

const UGLIFY_CONFIG = {mangle: {}, compress: {}, output: {ascii_only: true, beautify: false}}; //eslint-disable-line
const EXT_LIB_UGLIFY_CONFIG = {mangle: {}, compress: false, output: {ascii_only: true, beautify: false}}; //eslint-disable-line
const FINAL_UGLIFY_CONFIG = {mangle: {}, compress: false, output: {ascii_only: true, beautify: false}}; //eslint-disable-line

const SOURCE_CODE = [
    'src/**/*.js',
    '!src/lib/*.js',
    'gulpfile.js',
    'test/**/*.js',
    'tasks/**/*.js',
    'fixtures/*.js'
];

gulp.task('eslint', function() {
    return gulp.src(SOURCE_CODE)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('init', ['eslint']);

/* Tasks to create testing environment and run unit tests. */
/* Copy source code. */
gulp.task('copySrc', function() {
    const plugins = gulp.src('src/protectors/*.js')
        .pipe(uglify(UGLIFY_CONFIG))
        .pipe(gulp.dest('tmp/test/js/protectors'));

    const core = gulp.src('src/core/shockfish.js')
        .pipe(gulp.dest('tmp/test/js/core/'));

    const libs = gulp.src('src/lib/*.js')
        .pipe(uglify(EXT_LIB_UGLIFY_CONFIG))
        .pipe(gulp.dest('tmp/test/js/lib'));

    return merge(plugins, core, libs);
});

/* Inject config files into waf.js. */
gulp.task('injectConfigs', function() {
    fs.readdir('test/configs', function(err, files) {
        if (err) {
            throw err;
        }
        files.forEach(function(name) {
            var newName = name.split('.')[0];
            return gulp.src(['tmp/test/js/core/shockfish.js'])
                .pipe(rename('shockfish-' + newName + '.js'))
                .pipe(addShockfishConfig({
                    src: 'test/configs/' + name,
                    filter: 'shockfish-' + newName + '.js'
                }))
            .pipe(uglify(UGLIFY_CONFIG))
            .pipe(gulp.dest('tmp/test/js/core/'));
        });
    });
});

/* Create HTML pages for unit testing */
gulp.task('buildUnitTests', function() {
    const xssprotector = gulp.src('test/fixtures/xss*.html')
        .pipe(template({
            libraries: '<script src="../../../tmp/test/js/lib/purify.js"></script>\n\t<script src="../../../tmp/test/js/lib/acorn.js"></script>\n\t<script src="../../../tmp/test/js/lib/sanitizer.js"></script>',
            coreWithDefaultConfig: '<script src="../../../tmp/test/js/core/shockfish-xss.js"></script>',
            coreWithCustomConfig: '<script src="../../../tmp/test/js/core/shockfish-xss-config.js"></script>',
            xssprotector: '<script src="../../../tmp/test/js/protectors/xss.js"></script>'
        }))
        .pipe(gulp.dest('tmp/samples/xssprotector/'));

    return merge(xssprotector);
});

/* Run unit tests */
gulp.task('runUnitTests', function() {
    return gulp.src('test/unit/*.js')
        .pipe(casper())
        .on('end', function() {
            connect.serverClose();
        });
});

// Protectors dependencies map.
var dMap = Object.create(null);
dMap.xssprotector = {lib: ['acorn', 'dompurify', 'domsanitizer']};

const getLibPaths = function(current) {
    return {
        acorn: path.join(current, 'acorn.js'),
        dompurify: path.join(current, 'purify.js'),
        domsanitizer: path.join(current, 'sanitizer.js')
    };
};

gulp.task('release', function() {
    const libPaths = getLibPaths(SRC_PATH + '/lib/');
    const usedProtectors = require(CONFIG_PATH)['protectors'];
    var releasedLibs = [], lib = '';
    var releasedProtectors = [], items;
    
    if (usedProtectors) {
        for (const protector in dMap) {
            if (usedProtectors.indexOf(protector) !== -1) {
                items = dMap[protector]['lib'];
                for (let i = 0, len = items.length; i < len; i++) {
                    lib = items[i];
                    releasedLibs.push(libPaths[lib]);
                }
            }
        }
        
        if (usedProtectors.indexOf('xssprotector') !== -1) {
            releasedProtectors.push(SRC_PATH + '/protectors/xss.js');
        }
    }
    
    return gulp.src([SRC_PATH + '/core/shockfish.js'])
        .pipe(addsrc.append(releasedProtectors))
        .pipe(addShockfishConfig({src: CONFIG_PATH, filter: 'shockfish.js'}))
        .pipe(concat('shockfish.js', {newLine: '\r\n'}))
        .pipe(iife({useStrict: false, prependSemicolon: false}))
        .pipe(addsrc.prepend(releasedLibs))
        .pipe(concat('shockfish.js', {newLine: '\r\n'}))
        .pipe(uglify(FINAL_UGLIFY_CONFIG))
        .pipe(gulp.dest(BUILD_PATH));
});

/* Create HTML pages for sanity tests. */
gulp.task('buildSanityTests', function() {
    return gulp.src('test/fixtures/sanity-tests.html')
        .pipe(htmlbuild({
            js: htmlbuild.preprocess.js(function(block) {
                block.write('../../../build/shockfish.js');
                block.end();
            })
        }))
        .pipe(gulp.dest('tmp/samples/sanity'));
});

/* Run sanity tests. */
gulp.task('runSanityTests', function() {
    return gulp.src('test/sanity/*.js')
        .pipe(casper())
        .on('end', function() {
            connect.serverClose();
        });
});

/* Common tasks used in other tasks. */
gulp.task('connect', function() {
    connect.server({
        port: 9000,
        root: './',
    });
    
});

gulp.task('clean', function() {
    return gulp.src(['tmp/', 'samples/'], {read: false})
        .pipe(clean());
});

/* Called tasks. */
gulp.task('test', function(cb) {
    runSequence('copySrc', 'injectConfigs', 'buildUnitTests', 'connect', 'runUnitTests',
        function(err) {
            if (err) {
                var exitCode = 2;
                console.log('[ERROR] gulp test task failed - exiting with code ' + exitCode);
                return process.exit(exitCode);
            } else {
                return cb();
            }
        }
    );
});

gulp.task('testRelease', function(cb) {
    runSequence(
        'buildSanityTests',
        'connect',
        'runSanityTests',
        function(err) {
            if (err) {
                var exitCode = 2;
                console.log('[ERROR] gulp release task failed - exiting with code ' + exitCode);
                return process.exit(exitCode);
            } else {
                return cb();
            }
        }
        
    );
});

/* Default task. */
gulp.task('default', function(cb) {
    runSequence(
        'clean',
        'init',
        'test',
        'release',
        'testRelease',
        'clean',
        function(err) {
            if (err) {
                var exitCode = 2;
                return process.exit(exitCode);
            } else {
                console.log('RELEASE FINISHED SUCCESSFULLY');
            }
            cb();
        });

});
