module.exports = {
    path: {
        build: {
            html: 'dist/',
            js: 'dist/js/',
            css: 'dist/css/',
            img: 'dist/images/',
            fonts: 'dist/fonts/'
        },
        src: {
            html: 'src/*.html',
            js: 'src/js/jquery.main.js',
            style: 'src/scss/*.scss',
            img: 'src/sourceimages/**/*.*',
            fonts: 'src/fonts/**/*.*'
        },
        watch: {
            html: 'src/**/*.html',
            js: 'src/js/**/*.js',
            style: 'src/scss/**/*.scss',
            img: 'src/sourceimages/**/*.*',
            fonts: 'src/fonts/**/*.*'
        },
        clean: './dist'
    },
    src: 'src'

  };