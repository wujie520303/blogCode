 'use strict';

var gulp = require('gulp'),
    path = require('path'),
    through = require('through2'),
    del = require('del'),
    $ = require("gulp-load-plugins")();

function cleaner() {
  return through.obj(function(file, enc, cb){
    del(path.resolve( (file.cwd || process.cwd()), file.path)).then(function() {
      this.push(file);
      cb();
    }, function(err) {
      this.emit('error', new $.util.PluginError('Cleanup old files', err));
    });
  });
}

gulp.task('usemin', ['clean:rev'], function() {

  return gulp.src('./app/index.html')
    .pipe($.usemin({
      js: [$.uglify(), $.rev()],
      css: [$.minifyCss(), $.rev()]
    }))
    .pipe(gulp.dest('dist/'))
});

gulp.task('clean:rev', function() {
  gulp.src(['dist/**/*.*'], {read: false})
    .pipe( $.revOutdated(1)) // 只保存一个旧版本的rev
    .pipe(cleaner())

  return;
})


// 清空dist目录下的所有文件
gulp.task('clean', function() {
  gulp.src('./dist/*')
    .pipe($.clean())
});