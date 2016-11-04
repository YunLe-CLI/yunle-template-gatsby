// 引入gulp、gulp插件以及browser-sync
var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    $ = require('gulp-load-plugins')();

// 自动编译html的任务
gulp.task('html', function () {
  return gulp.src('src/**.html')
      .pipe(gulp.dest('.tmp'));
});
gulp.task('build-html', function () {
  var version = (new Date).valueOf() + '';
  var options = {
        removeComments: false, // 清除HTML注释
        collapseWhitespace: true, // 压缩HTML
        collapseBooleanAttributes: false, // 省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: false, // 删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: false, // 删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: false, // 删除<style>和<link>的type="text/css"
        minifyJS: true, // 压缩页面里的JS
        minifyCSS: true // 压缩页面里的CSS
    };
  return gulp.src('src/**.html')
      .pipe($.revAppend())
      .pipe($.htmlmin(options))
      .pipe(gulp.dest('dist'));
});

// 自动编译less的任务
gulp.task('less', function(){
  return gulp.src('src/less/*.less')
      .pipe($.sourcemaps.init())
      .pipe($.less())
      .pipe($.sourcemaps.write('.maps'))
      .pipe(gulp.dest('.tmp/css'))
      .pipe(browserSync.stream());
});
gulp.task('build-less', function(){
  return gulp.src('src/less/*.less')
      .pipe($.less())
      .pipe($.autoprefixer({browsers:['> 1%', 'last 2 versions', 'Firefox ESR']}))
      .pipe($.minifyCss())
      .pipe($.rename({
        suffix: ".min"
      }))
      .pipe(gulp.dest('dist/css'))
});

// 压缩图片任务
gulp.task('images', function () {
  return gulp.src('src/images/*.*')
      .pipe($.cache($.imagemin({
        optimizationLevel: 3,
        progressive: true,
        interlaced: true
      })))
      .pipe(gulp.dest('.tmp/images'));
});
gulp.task('build-images', function () {
  return gulp.src('src/images/*.*')
      .pipe(gulp.dest('dist/images'));
});

// 压缩 js 文件
gulp.task('script', function() {
  return gulp.src('src/js/*.js')
      .pipe($.sourcemaps.init())
      .pipe($.babel({
          presets: ['es2015']
      }))
      .pipe($.sourcemaps.write('.maps'))
      .pipe(gulp.dest('.tmp/js'))
      .pipe(browserSync.stream());
});
gulp.task('build-script', function() {
  return gulp.src('src/js/*.js')
      .pipe($.uglify())
      .pipe(gulp.dest('dist/js'))
});

// 开发环境gulp任务
gulp.task('serve', ['html', 'less', 'images', 'script'], function () {
  browserSync.init({
    notify : false,
    server: '.tmp'
  });
  // 监听js文件的变化，自动执行'script'任务
  gulp.watch("src/js/**.js", ['script']).on('change', function(event){
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
  // 监听less文件的变化，自动执行'less'任务
  gulp.watch('src/less/*.less', ['less']).on('change', function(event){
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
  //监听html文件的变化，自动重新载入
  gulp.watch('src/**.html').on('change', browserSync.reload).on('change', function(event){
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
});

// 生产环境gulp任务
gulp.task('build', ['build-html', 'build-less', 'build-images', 'build-script'], function() {

});

//默认启动的gulp任务数组['serve']
gulp.task('default', ['serve']);
