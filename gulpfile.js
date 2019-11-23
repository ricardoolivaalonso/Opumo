/*
npm install gulp -g
npm init
npm install --save-dev gulp

npm install --save-dev gulp-pug
npm install --save-dev gulp-sass
npm install --save-dev gulp-autoprefixer
npm install --save-dev browser-sync
npm install --save-dev gulp-plumber

npm install --save-dev gulp-babel
npm install --save-dev gulp-babel @babel/core @babel/preset-env
*/

// ***** Módulos *****
const { src, dest, watch, series, parallel } = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync').create();
// ***** Path *****
const pugFile = './dev/pug/index.pug';
const scssFile = './dev/scss/styles.scss';
const jsFile = './dev/js/main.js';
const dist = './public/';
// ***** Tareas *****
function html() {
  return src( pugFile )
    .pipe( plumber() )
    .pipe( pug() )
    // .pipe( pug({pretty:true}) )
    .pipe( dest( dist ) )
    .pipe( browserSync.reload({ stream: true }) )
}
function css() {
  return src( scssFile )
    .pipe( plumber() )
    .pipe( sass({ outputStyle: 'compressed' }).on( 'error', sass.logError ))
    .pipe(autoprefixer({
      browsers: ['last 5 versions'],
      cascade: false
    }))
    .pipe(dest( dist + 'css' ))
    .pipe( browserSync.reload({ stream: true }) )
}
function js(){
  return src( jsFile )
    .pipe( plumber() )
    .pipe(babel({ presets: ['@babel/env'] }))
    .pipe(dest( dist + 'js' ))
    .pipe(browserSync.reload({ stream: true }))
}
function browser(done) {
  browserSync.init({  server: { baseDir: dist } });
  done();
}
function watcher() {
  watch( './dev/pug/*.pug' , { events: 'all' } , parallel( html ));
  watch( './dev/scss/**/*.scss' , { events: 'all' } , parallel( css ));
  watch( jsFile, { events: 'all' } , parallel( js ));
}
// Exports
exports.html = html;
exports.css = css;
exports.js = js;
exports.watch = watcher;
exports.default = parallel(browser, watcher);
