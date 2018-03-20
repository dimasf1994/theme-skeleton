'use strict';

import gulp from 'gulp'
import sources from  './package.json'
import browserSync from 'browser-sync'
import header from 'gulp-header'
import sourcemaps from 'gulp-sourcemaps'

let banner = [
    '/**',
    ' * <%= sources.name %> - <%= sources.description %>',
    ' * @author <%= sources.author.name %>',
    ' * @version v <%= sources.version %>',
    ' * @link <%= sources.author.homepage %> ',
    ' * @license <%= sources.license %>',
    ' */',
    ''
].join('\n')

import sass from 'gulp-sass'
import cssnano from 'gulp-cssnano'
import autoprefixer from 'gulp-autoprefixer'

import concat from 'gulp-concat'
import jshint from 'gulp-jshint'
import uglify from 'gulp-uglify'

browserSync.create()

const browser_support = [
  'last 2 versions',
  '> 5%',
  'Firefox ESR',
  "ie >= 10",
  "ff >= 30",
  "chrome >= 34",
  "safari >= 30",
  "opera >= 23",
  "ios >= 7",
  "android >= 4.4",
  "bb >= 10"
]

//Task

gulp.task('html', () => {
  return gulp.src('*.html')
      .pipe(gulp.dest('./'))
      .pipe(browserSync.stream())
})

gulp.task('sass', () => {
  return gulp.src("./sass/**/*.scss")
      .pipe(sourcemaps.init())
      .pipe(sass({outputStyle: 'compressed', errLogToConsole: true}).on('error', sass.logError))
      .pipe(concat(sources.name + '.min.css'))
      .pipe(cssnano({autoprefixer:{ browsers: browser_support, add: true }}))
      .pipe(sourcemaps.write('./dist/css'))
      .pipe(header(banner,{sources : sources}))
      .pipe(gulp.dest("./dist/css"))
      .pipe(browserSync.stream())
})

gulp.task('javascript', () => {
    return gulp.src('./js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'))
        .pipe(sourcemaps.init())
        .pipe(concat(sources.name + '.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./dist/js'))
        .pipe(header(banner, { sources:sources}))
        .pipe(gulp.dest('./dist/js'))
        .pipe(browserSync.stream())
})

gulp.task('default', () => {
  browserSync.init({
      server:"./"
  })
  gulp.watch('**/*.sass', (event) => {
      console.log(event);
      gulp.start('sass');
  })
  gulp.watch('js/**/*.js', (event) => {
      console.log(event);
      gulp.start('javascript');
  })
  gulp.watch('*.html', (event) => {
      console.log(event);
      gulp.start('html').on('change', browserSync.reload);
  })
})
