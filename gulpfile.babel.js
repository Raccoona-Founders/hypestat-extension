const gulp = require('gulp');
const path = require('path');
const zip = require('gulp-zip');
const jsoneditor = require('gulp-json-editor');

const packageJson = require('./package.json');
const manifest = require('./resources/manifest.json');

const PATH = {
  SOURCE: path.join(__dirname, './src'),
  TARGET: path.join(__dirname, './dist')
};

gulp.task('copy:root', copyTask({
  source: './app/',
  destinations: [
    './dist'
  ],
  pattern: '/*',
}));

gulp.task('copy:images', copyTask({
  source: './resources/images/',
  destinations: [
    './dist/images'
  ]
}));

gulp.task('copy:fonts', copyTask({
  source: './resources/fonts/',
  destinations: [
    './dist/fonts'
  ]
}));

gulp.task('copy:views', copyTask({
  source: './resources/views/',
  destinations: [
    './dist/views'
  ]
}));

gulp.task('copy:locales', copyTask({
  source: './resources/_locales/',
  destinations: [
    './dist/_locales'
  ]
}));

gulp.task('manifest:production', () => {
  return gulp
    .src('./resources/manifest.json')
    .pipe(jsoneditor((json) => {
      json.version = packageJson.version;

      return json;
    }))
    .pipe(jsoneditor((json) => {
      delete json.applications;

      return json;
    }))
    .pipe(gulp.dest('./dist', {overwrite: true}));
});

//|---------------------------------------------------------------------------
//| Configuration for create JavaScript bundles
//| Use WebPack
//|---------------------------------------------------------------------------


const staticFiles = ['images', 'views', 'root', 'fonts', 'locales'];
let copyStrings = staticFiles.map(staticFile => `copy:${staticFile}`);
gulp.task('copy', gulp.series(
  ...copyStrings,
  'manifest:production'
));

gulp.task('build', gulp.parallel('copy'));

gulp.task('copy:watch', function () {
  // @ts-ignore
  gulp.watch(['./src/*.*'], 'build');
});

gulp.task('zip', zipTask());

function copyTask(opts) {
  const {
    source,
    destination,
    destinations = [destination],
    pattern = '/**/*'
  } = opts;

  return () => {
    let stream = gulp.src(source + pattern, {base: source});
    destinations.forEach((destination) => {
      stream = stream.pipe(gulp.dest(destination));
    });

    return stream;
  };
}

function zipTask() {
  return () => {
    return gulp
      .src(`./dist/**`)
      .pipe(zip(`ig-followers-with-tags-${packageJson.version}.zip`))
      .pipe(gulp.dest('./builds'));
  }
}