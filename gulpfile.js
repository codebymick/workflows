var gulp = require('gulp'),
  gutil = require('gulp-util'),
  concat = require('gulp-concat'),
  compass = require('gulp-compass'),
  connect = require('gulp-connect'),
  browserify = require('gulp-browserify'),
  gulpif = require('gulp-if'),
  uglify = require('gulp-uglify'),
  minifyHTML = require('gulp-minify-html'),
  jsonminify = require('gulp-jsonminify'),
  coffee = require('gulp-coffee');


  var env,
      coffeeSources,
      jsonSources,
      htmlSources,
      jsSources,
      sassSources,
      outputDir,
      sassStyle;
  
  
  var env = process.env.NODE_ENV || 'production';
  
  if (env ==='development') {
    outputDir = 'builds/development/';
    sassStyle = 'expanded';
  } else{
    outputDir = 'builds/production/';
    sassStyle = 'compressed';
  }
  
  coffeeSources = ['components/coffee/*.coffee'];
  htmlSources = [outputDir + '*.html'];
  jsonSources = [outputDir + 'js/*.json'];
  
  jsSources = [
    'components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'
  ];
  sassSources = ['components/sass/style.scss']

gulp.task('coffee', function(){
  gulp.src(coffeeSources)
    .pipe(coffee({bare: true}))
      .on('error', gutil.log)
    .pipe(gulp.dest('components/scripts'))

});

gulp.task('js', function() {
  gulp.src(jsSources)
  .pipe(concat('script.js'))
  .pipe(browserify())
  .pipe(gulpif(env === 'production', uglify()))
  .pipe(gulp.dest(outputDir + 'js'))
  .pipe(connect.reload())
});


gulp.task('compass', function() {
  gulp.src(sassSources)
  .pipe(compass({
    sass: 'components/sass',
    image: outputDir + 'images',
    style: sassStyle
  }))
  .on('error', gutil.log)
    .pipe(gulp.dest(outputDir + 'css'))
    .pipe(connect.reload())
});

gulp.task('default',['json','html' ,'coffee', 'js', 'compass', 'connect', 'watch']);

gulp.task('watch', function(){
  gulp.watch(coffeeSources, ['coffee']);
  gulp.watch(jsSources, ['js']);
  gulp.watch('components/sass/*.scss', ['compass']);
  gulp.watch('builds/development/*.html', ['html']);
  gulp.watch('builds/development/js/*.json', ['json']);
  gulp.watch(jsonSources, ['json']);
});

gulp.task('connect', function(){
  connect.server({
    root: outputDir,
    livereload: true
  });
});

gulp.task('html', function() {
  gulp.src('builds/development/*.html')
  .pipe(gulpif(env === 'production', minifyHTML()))
  .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
  .pipe(connect.reload())
});

gulp.task('json', function() {
  gulp.src('builds/development/js/*.json')
  .pipe(gulpif(env === 'production', jsonminify()))
  .pipe(gulpif(env === 'production', gulp.dest('builds/production/js')))
  .pipe(connect.reload())
});