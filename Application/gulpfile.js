/*
    Gulp Build System for Ionic2
    Copyright(C) 2016 Ha Hyeon soo
    update : 20160705

    - ionic-gulp-browserify-typescript
    - ionic-gulp-sass-build
    - ionic-gulp-fonts-copy
    - ionic-gulp-scripts-copy
    - gulp-jade [*]  <- replaced ionic-gulp-html-copy


    [berfore to run]
	- npm install -d gulp-jade --verbose
        - package.json -> Add "gulp-jade" : "x.x.x" on [devDependencies] list
        - Copy this code! & Enjoy!
*/

require('es6-promise').polyfill();

var gulp = require('gulp'),
    gulpWatch = require('gulp-watch'),
    del = require('del'),
    runSequence = require('run-sequence'),
    argv = process.argv;


/**
 * Ionic hooks
 * Add ':before' or ':after' to any Ionic project command name to run the specified
 * tasks before or after the command.
 */
gulp.task('serve:before', ['watch']);
gulp.task('emulate:before', ['build']);
gulp.task('deploy:before', ['build']);
gulp.task('build:before', ['build']);



/**
 * Ionic Gulp tasks, for more information on each see
 * https://github.com/driftyco/ionic-gulp-tasks
 *
 * Using these will allow you to stay up to date if the default Ionic 2 build
 * changes, but you are of course welcome (and encouraged) to customize your
 * build however you see fit.
 */
var buildBrowserify = require('ionic-gulp-browserify-typescript');
var buildSass = require('ionic-gulp-sass-build');
var copyFonts = require('ionic-gulp-fonts-copy');
var copyScripts = require('ionic-gulp-scripts-copy');
var jadeBuild = require('gulp-jade');

var isRelease = argv.indexOf('--release') > -1;

gulp.task('watch', ['clean'], function(done){
  runSequence(
    ['jade', 'sass', 'fonts', 'scripts'],
    function(){
      gulpWatch('app/**/*.scss', function(){ gulp.start('sass'); });
      gulpWatch('app/**/*.jade', function(){ gulp.start('jade'); });
      buildBrowserify({ watch: true }).on('end', done);
    }
  );
});

gulp.task('build', ['clean'], function(done){
  runSequence(
    ['jade', 'sass', 'fonts', 'scripts'],
    function(){
      buildBrowserify({
        minify: isRelease,
        browserifyOptions: {
          debug: !isRelease
        },
        uglifyOptions: {
          mangle: false
        }
      }).on('end', done);
    }
  );
});

//Custom Jade for ionic2
gulp.task('jade', function(){
    gulp.src('app/**/*.jade')  // target
        .pipe(jadeBuild({}).on('error',function(err){
            console.log("[+] Error : ",err)
        }))
        .pipe(gulp.dest(function(file){ //destination
            return 'www/build';
        }));
});

gulp.task('sass', buildSass);
gulp.task('fonts', copyFonts);
gulp.task('scripts', copyScripts);
gulp.task('clean', function(){
  
  return del('www/build');
});

