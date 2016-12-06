// 引入gulp、gulp插件以及browser-sync
var gulp = require('gulp'),
    proxyMiddleware = require('http-proxy-middleware'),
    browserSync = require('browser-sync').create(),
    $ = require('gulp-load-plugins')();

var config = require('./app/config/server.config');
var mockRouter = require('./app/router/API.mock');

var target = config.proxy.host;
var proxyPath = config.proxy.path;

function handleErrors(err) {
  var args = Array.prototype.slice.call(arguments);
  $.notify.onError({
      title: 'compile error',
      message: '<%=error.message %>'
  }).apply(this, args);
  this.emit();
}

// 自动编译html的任务
gulp.task('html', function () {
  return gulp.src('src/view/**.html')
      .pipe(gulp.dest('.tmp'))
      .on('error', handleErrors)
      .pipe($.notify("html 编译成功!"));
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
  return gulp.src('src/view/**.html')
      .pipe($.revAppend())
      .pipe($.htmlmin(options))
      .on('error', handleErrors)
      .pipe(gulp.dest('dist/view'))
      .pipe($.notify("html 编译成功!"));
});

// 自动编译less的任务
gulp.task('less', function(){
  return gulp.src('src/less/**.less')
      .pipe($.less())
      .on('error', handleErrors)
      .pipe(gulp.dest('.tmp/css'))
      .pipe(browserSync.stream())
      .pipe($.notify("less 编译成功!"));
});
gulp.task('build-less', function(){
  return gulp.src('src/less/**.less')
      .pipe($.less())
      .pipe($.autoprefixer({browsers:['> 1%', 'last 2 versions', 'Firefox ESR']}))
      .pipe($.minifyCss())
      .pipe($.rename({
        suffix: ".min"
      }))
      .on('error', handleErrors)
      .pipe(gulp.dest('dist/css'))
      .pipe($.notify("less 编译成功!"));
});

// 压缩图片任务
gulp.task('images', function () {
  return gulp.src('src/images/**.*')
      .pipe($.cache($.imagemin({
        optimizationLevel: 3,
        progressive: true,
        interlaced: true
      })))
      .on('error', handleErrors)
      .pipe(gulp.dest('.tmp/images'))
      .pipe($.notify("images 编译成功!"));
});
gulp.task('build-images', function () {
  return gulp.src('src/images/**.*')
      .on('error', handleErrors)
      .pipe(gulp.dest('dist/images'))
      .pipe($.notify("images 编译成功!"));
});

// 压缩 js 文件
gulp.task('script', function() {
  return gulp.src('src/js/**.js')
      .on('error', handleErrors)
      .pipe(gulp.dest('.tmp/js'))
});
gulp.task('build-script', function() {
  return gulp.src('src/js/**.js')
      .pipe($.uglify())
      .on('error', handleErrors)
      .pipe(gulp.dest('dist/js'))
      .pipe($.notify("js 编译成功!"));
});

// 语法检测
gulp.task('eslint', () => {
  return gulp.src(['src/js/**.js'])
      .pipe($.eslint({ configFle: './.eslintrc' }))
      .pipe($.eslint.format())
      .pipe($.eslint.failAfterError())
      .on('error', handleErrors)
      .pipe($.notify("语法检测成功!"));
});

// 开发环境gulp任务
gulp.task('serve', ['html', 'less', 'images', 'script', 'eslint'], function () {
  // 代理
  var _proxyMiddleware = proxyMiddleware([proxyPath], { target: target, changeOrigin: true });
  var middleware = [
    _proxyMiddleware
  ];
  browserSync.init({
    notify : false,
    server: '.tmp',
    middleware: middleware.concat(mockRouter)
  });
  // 监听js文件的变化，自动执行'script'任务
  gulp.watch("src/js/**.js", ['script']).on('change', function(event){
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
  // 监听less文件的变化，自动执行'less'任务
  gulp.watch('src/less/*.less', ['less']).on('change', function(event){
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
  // 监听images文件的变化，自动执行'images'任务
  gulp.watch('src/less/*.less', ['images']).on('change', function(event){
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
  //监听html文件的变化，自动重新载入
  gulp.watch('src/**.html').on('change', browserSync.reload);
});

gulp.task('clean', function () {
  return gulp.src('.tmp/**', {read: false})
    .pipe($.clean())
    .on('error', handleErrors);

});
gulp.task('build-clean', function () {
  return gulp.src('dist/**', {read: false})
    .pipe($.clean())
    .on('error', handleErrors);
});

// 生产环境gulp任务
gulp.task('build', ['build-html', 'build-less', 'build-images', 'build-script', 'eslint'], function() {
  console.log('打包完成！');
});

//默认启动的gulp任务数组['serve']
gulp.task('default', ['serve']);
