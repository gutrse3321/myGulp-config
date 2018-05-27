var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    minifyCss = require('gulp-minify-css'),
    htmlmin = require('gulp-htmlmin'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    del = require('del'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    runSequence = require('run-sequence');

/**
 * htmlmin
 * 压缩HTML
 */
gulp.task('html', function () {
  var options = {
    // 清除HTML注释
    removeComments: true,
    // 压缩HTML，去空格
    collapseWhitespace: true,
    // 省略布尔属性的值
    // <input checked="true"/> ==> <input />
    // collapseBooleanAttributes: true,
    // 删除所有空格作属性值
    // <input id="" /> ==> <input />
    removeEmptyAttributes: true,
    // 删除script的type="text/javascript"
    removeScriptTypeAttributes: true,
    // 删除style和link的type="text/css"
    removeStyleLinkTypeAttributes: true,
    // 压缩页面JS
    minifyJS: true,
    // 压缩页面CSS
    minifyCSS: true
  };
  // src/html/*.html
  gulp.src('src/index.html')
    .pipe(htmlmin(options))
    .pipe(gulp.dest('./src/dist'));
});

/**
 * uglify
 * 压缩JS
 */
gulp.task('js', function (done) {
  return gulp.src('src/js/*.js')
    .pipe(concat('bundle.js')) // 合并成的js文件名
    .pipe(uglify()) // 压缩
    .pipe(gulp.dest('./src/dist/js')); // 打包压缩在src/dist/js目录下
});

/**
 * stylus
 * 编译stylus文件
 */
gulp.task('stylus', function () {
  return gulp.src('./src/stylus/index.styl')
    .pipe(stylus())
    .pipe(minifyCss())
    // .pipe(concat('index.min.css'))
    .pipe(gulp.dest('./src/dist/css'))
    .pipe(reload({ stream: true }));
})

/**
 * del
 * 删除打包的src/dist
 */
gulp.task('clean', function () {
  return del('./src/dist');
});

/**
 * browserSync
 * 监视stylus的改动，若有改变，运行'stylus'任务
 */
gulp.task('serve', ['stylus'], function () {
  browserSync({
    server: {
      baseDir: 'src'
    }
  });

  gulp.watch('src/stylus/index.styl', ['stylus']);
});

/**
 * runSequence
 * 串行执行任务
 */
gulp.task('build', function (callback) {
  runSequence('clean', ['html', 'js', 'stylus'], callback);
});