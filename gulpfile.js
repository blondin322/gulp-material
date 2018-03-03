'use strict';

var PathConfig = require('./gulp-settings.js'),
    gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    csscomb = require('gulp-csscomb'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    notify = require('gulp-notify'),
    plumber= require('gulp-plumber'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

var path = PathConfig.path;
var config = {
    server: {
        baseDir: "./",
        index: "index.html",
        directory: true
    },
    tunnel: true,
    host: 'localhost',
    port: 3000,
    logPrefix: "Frontend"
};


gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('js:dist', function () {
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(uglify())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(plumber(notify.onError()))
        .pipe(sass({
            includePaths: [PathConfig.sourceFolder + '/scss/'],
            outputStyle: 'nested',
            sourceMap: true,
            errLogToConsole: true
        }))
        .pipe(prefixer())
        //.pipe(cssmin())
        .pipe(sourcemaps.init())
        .pipe(csscomb())
        .pipe(sourcemaps.write(PathConfig.sourceFolder + '/scss/'))
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('style:dist', function () {
    gulp.src(path.src.style)
        .pipe(plumber(notify.onError()))
        //.pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: [PathConfig.sourceFolder + 'scss/'],
            outputStyle: 'nested',
            sourceMap: false,
            errLogToConsole: true
        }))
        .pipe(prefixer())
        //.pipe(cssmin())
        .pipe(csscomb())
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('compress', function() {
  gulp.src(PathConfig.sourceFolder + '/sourceimages/*')
  .pipe(plumber(notify.onError()))
  .pipe(imagemin({
     progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()],
    interlaced: true
    }))
  .pipe(gulp.dest(path.build.img))
  .pipe(reload({stream: true}));
});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build'
]);


gulp.task('final-dist', [
    'html:build',
    'js:dist',
    'style:dist',
    'fonts:build',
    'image:build'
]);


gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});


gulp.task('default', ['build', 'webserver', 'watch']);
gulp.task('dist', ['final-dist']);

