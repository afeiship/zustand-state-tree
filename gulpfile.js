const gulp = require('gulp');
const { CleanRegistry, TsScripts } = require('@jswork/gulp-registry');
const path = require('path');
const pkgHeader = require('@jswork/gulp-pkg-header');
const rename = require('gulp-rename');
const gulpTs = require('gulp-typescript');
const tsconfig = require(path.join(process.cwd(), 'tsconfig.json'));
const opts = tsconfig.compilerOptions;
const replace = require('gulp-replace');

const task1 = new CleanRegistry();
const task2 = new TsScripts();

[task1, task2].forEach(gulp.registry);

gulp.task('ts:scripts:esmp', function () {
  return gulp
    .src('src/*.ts')
    .pipe(pkgHeader())
    .pipe(gulpTs({ ...opts, module: 'esnext' }))
    .pipe(rename({ extname: '.esm.js' }))
    .pipe(gulp.dest('dist'));
});

gulp.task(
  'default',
  gulp.series(['clean', 'ts:scripts:cjs', 'ts:scripts:esmp', 'ts:scripts:typing'])
);
