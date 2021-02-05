/*

Run these commands

## if the project is already set up and running:
npm install

## if you check package.json and there aren't dependencies listed ( there should be no reason to do this )
npm install gulp
npm install bower --save-dev
npm install gulp-imagemin --save-dev
npm install gulp-concat --save-dev
npm install gulp-plumber --save-dev
npm install gulp-autoprefixer --save-dev
npm install gulp-minify-css --save-dev
npm install gulp-uglify --save-dev
npm install gulp-rename --save-dev
npm install gulp-notify --save-dev
npm install gulp-include --save-dev
npm install gulp-ruby-sass --save-dev
npm install gulp-watch --save-dev
npm install gulp-sourcemaps --save-dev
npm install gulp-newer --save-dev

## always ( to compile/watch/etc )
bower
gulp

*/


// Config for theme
let settings    = require('./package.json');

// Gulp Nodes
let gulp = require( 'gulp' );
let rename = require( 'gulp-rename' );
let sass = require( 'gulp-sass' );

let plumber = require( 'gulp-plumber' );
let watch = require( 'gulp-watch' );
let minifyCSS = require('gulp-minify-css');
let terser = require( 'gulp-terser' );
let notify = require( 'gulp-notify' );
let concat = require('gulp-concat');
let imagemin = require('gulp-imagemin');
let sourcemaps = require('gulp-sourcemaps');

sass.compiler = require('node-sass');

// Error Handling
let onError = function( err ) {
	console.log( 'An error occurred:', err.message );
	this.emit( 'end' );
};


const scssSrc = './src/scss/style.scss';
const scssOutput = './';

gulp.task('scss', () => {
	return gulp.src(scssSrc)
	  .pipe(sass().on('error', sass.logError))
		.pipe(minifyCSS({keepBreaks:false}))
    .pipe(sourcemaps.write('./maps'))
    .pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(scssOutput))
		.pipe(notify({ message: 'Scss task complete' }));
});

const jsSrc = './src/js/**/*.js';
const jsOutput = './';

gulp.task('scripts', ()  =>{
	return gulp.src( jsSrc )
		.pipe(concat('js.js'))
		.pipe(rename({suffix: '.min'}))
		.pipe(terser())
		.pipe(gulp.dest( jsOutput ))
		.pipe(notify({ message: 'Scripts task complete' }));
});


//Compress images 
// Optionally, add dependencies 
// $ npm install --save-dev imagemin-jpegtran imagemin-svgo imagemin-gifsicle imagemin-optipng
gulp.task('images', () => {
  return gulp.src("./src/img/*")
  .pipe(imagemin())
  .pipe(gulp.dest("./img"));
});


// Watch task -- this runs on every save.
gulp.task( 'watch', () => {

	// Watch all .scss files
	gulp.watch( './src/scss/*css' , gulp.series('scss') );
	// Watch main style.scss file for new inclusions
	gulp.watch( scssSrc , gulp.series('scss') );

	// Watch js files
  gulp.watch( jsSrc , gulp.series('scripts') );
  
  //Watch images
	gulp.watch( "./src/img/*" , gulp.series('images') );

});


// Default task -- runs scss and watch functions
gulp.task( 'default', gulp.parallel('scripts', 'scss', 'images', 'watch'));