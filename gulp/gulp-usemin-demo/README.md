# [gulp-usemin简单使用](http://www.cnblogs.com/wujie520303/p/4964931.html)附带示例代码

### 代码结构

```
+- app
|   +- index.html
|   +- assets
|       +- js
|          +- foo.js
|          +- bar.js
|          +- baz.js
|   +- css
|       +- clear.css
|       +- main.css
+- dist
+- node_modules
+- gulpfile.js
```

### 使用说明

```
git clone https://github.com/wujie520303/blogCode.git

cd blogCode/gulp/gulp-usemin-demo

npm install

gulp usemin
```

其中：

 - `app/index.html`源文件：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>gulp-usemin示例</title>
  <!-- build:css style.css -->
  <link rel="stylesheet" href="css/clear.css"/>
  <link rel="stylesheet" href="css/main.css"/>
  <!-- endbuild -->
</head>
<body>
  <!-- build:js js/optimized.js -->
  <script src="assets/js/foo.js"></script>
  <script src="assets/js/bar.js"></script>
  <!-- endbuild -->
</body>
</html>
```

 - gulp配置文件：

```javascript
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
```

执行后的`dist/index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>gulp-usemin示例</title>
  <link rel="stylesheet" href="style-fffb5ca589.css"/>
</head>
<body>
  <script src="js/optimized-62fa5ef80a.js"></script>
</body>
</html>
```

最终生成的`dist/`目录(有可能不一致)

```
+- dist
|   +- js
|       +- optimized-62fa5ef80a.js
|   +- index.html
|   +- style-2091d1f99f.css
|   +- style-fffb5ca589.css
```