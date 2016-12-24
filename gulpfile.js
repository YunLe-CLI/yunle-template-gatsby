const gulp = require('gulp');
const proxyMiddleware = require('http-proxy-middleware');
const browserSync = require('browser-sync').create();
const $ = require('gulp-load-plugins')();
var autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    pngquant = require('imagemin-pngquant'),
    minimist = require('minimist');
const config = require('./app/config/server.config');
const mockRouter = require('./app/router/API.mock');

var knownOptions = {
  string: 'env',
  default: { env: process.env.NODE_ENV || 'production' }
};

var options = minimist(process.argv.slice(2), knownOptions);

const proxys = config.proxys;
const PATHS = {
  html: ['./src/view/**.html'],
  styleCss: ['./src/styles/css/**.css'],
  styleLess: ['./src/styles/less/**.less'],
};

function handleErrors(err) {
  const args = Array.prototype.slice.call(arguments);
  $.notify.onError({
      title: 'compile error',
      message: '<%=error.message %>'
  }).apply(this, args);
  this.emit();
}

// 自动编译html的任务
gulp.task('html', function () {
  return gulp.src(PATHS.html)
      .pipe($.changed('.tmp', {extension: '.html'}))
      .pipe($.revAppend({
          assetsDir: '/public'
      }))
      .on('error', handleErrors)
      .pipe(gulp.dest('.tmp'))
      // .pipe($.notify("html 编译成功!"));
});
gulp.task('build-html', function () {
  const version = (new Date).valueOf() + '';
  const options = {
    removeComments: true, // 清除HTML注释
    collapseWhitespace: false, // 压缩HTML
    collapseBooleanAttributes: true, // 省略布尔属性的值 <input checked="true"/> ==> <input />
    removeEmptyAttributes: true, // 删除所有空格作属性值 <input id="" /> ==> <input />
    removeScriptTypeAttributes: true, // 删除<script>的type="text/javascript"
    removeStyleLinkTypeAttributes: true, // 删除<style>和<link>的type="text/css"
    minifyJS: true, // 压缩页面里的JS
    minifyCSS: true, // 压缩页面里的CSS
  };
  return gulp.src(PATHS.html)
      .pipe($.changed('dist/view', {extension: '.html'}))
      .pipe($.revAppend({
          assetsDir: '/teset'
      }))
      .pipe($.htmlmin(options))
      .on('error', handleErrors)
      .pipe(gulp.dest('dist/view'))
      // .pipe($.notify("html 编译成功!"));
});

const processors = [
  autoprefixer({browsers: ['last 1 version']}),
  cssnano(),
];

// 自动编译css的任务
gulp.task('css', function () {
    return gulp.src(PATHS.styleCss)
        .pipe($.changed('.tmp', {extension: '.css'}))
        .on('error', handleErrors)
        .pipe($.sourcemaps.init())
        .pipe($.postcss(processors))
        .pipe($.sourcemaps.write('./maps'))
        .pipe(gulp.dest('dist/css'))
        .pipe($.minifyCss())
        .pipe($.rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream())
        .pipe($.notify("css 编译成功!"));
});
gulp.task('build-css', function () {
    return gulp.src(PATHS.styleCss)
        .pipe($.changed('dist/css', {extension: '.css'}))
        .on('error', handleErrors)
        .pipe($.sourcemaps.init())
        .pipe($.postcss(processors))
        .pipe($.sourcemaps.write('./maps'))
        .pipe(gulp.dest('dist/css'))
        .pipe($.minifyCss())
        .pipe($.rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream())
        .pipe($.notify("css 编译成功!"));
});
// 自动编译less的任务
gulp.task('less', function(){
  return gulp.src(PATHS.styleLess)
      .pipe($.changed('.tmp/css', {extension: '.less'}))
      .on('error', handleErrors)
      .pipe($.sourcemaps.init())
      .pipe($.less())
      .pipe($.postcss(processors))
      .pipe($.sourcemaps.write('./maps'))
      .pipe(gulp.dest('.tmp/css'))
      .pipe($.minifyCss())
      .pipe($.rename({ suffix: '.min' }))
      .pipe(gulp.dest('.tmp/css'))
      .pipe(browserSync.stream())
      .pipe($.notify("less 编译成功!"));
});
gulp.task('build-less', function(){
  return gulp.src(PATHS.styleLess)
      .pipe($.changed('dist/css', {extension: '.less'}))
      .on('error', handleErrors)
      .pipe($.sourcemaps.init())
      .pipe($.less())
      .pipe($.postcss(processors))
      .pipe($.sourcemaps.write('./maps'))
      .pipe(gulp.dest('dist/css'))
      .pipe($.minifyCss())
      .pipe($.rename({ suffix: '.min' }))
      .pipe(gulp.dest('dist/css'))
      .pipe(browserSync.stream())
      .pipe($.notify("less 编译成功!"));
});

// 压缩图片任务
gulp.task('images', function () {
  return gulp.src('src/images/**.{png,jpg,gif,ico}')
      .pipe($.changed('.tmp/images'))
      .on('error', handleErrors)
      .pipe(gulp.dest('.tmp/images'))
      .pipe($.notify("images 编译成功!"));
});
gulp.task('build-images', function () {
  return gulp.src('src/images/**.{png,jpg,gif,ico}')
      .pipe($.changed('dist/images'))
      .pipe($.cache($.imagemin({
        optimizationLevel: 3,
        progressive: true,
        interlaced: true,
        multipass: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()],
      })))
      .on('error', handleErrors)
      .pipe(gulp.dest('dist/images'))
      .pipe($.notify("images 编译成功!"));
});

// 压缩 js 文件
gulp.task('script', function() {
  return gulp.src('src/js/**.js')
      .pipe($.changed('.tmp/js', {extension: '.js'}))
      .on('error', handleErrors)
      .pipe(gulp.dest('.tmp/js'))
});
gulp.task('build-script', function() {
  return gulp.src('src/js/**.js')
      .pipe($.changed('dist/js', {extension: '.js'}))
      .pipe($.uglify())
      .on('error', handleErrors)
      .pipe(gulp.dest('dist/js'))
      .pipe($.notify("js 编译成功!"));
});

// 语法检测
gulp.task('eslint', () => {
  return gulp.src(['src/js/**.js','!node_modules/**'])
      .pipe($.eslint())
      .pipe($.eslint.format())
      .pipe($.eslint.failAfterError())
});

gulp.task('libs', () => {
  gulp.src('src/libs/**/**.*')
      .pipe(gulp.dest('.tmp/libs'))
})
gulp.task('build-libs', () => {
  gulp.src('src/libs/**/**.*')
      .pipe(gulp.dest('dist/libs'))
})

// 开发环境gulp任务
gulp.task('serve', ['libs', 'html', 'css', 'less', 'images', 'script', 'eslint'], function () {
  // 代理
  var middleware = [];
  for (var i = 0; i < proxys.length; i++) {
    middleware.push(proxyMiddleware([proxys[i].path], { target: proxys[i].host, changeOrigin: true }))
  }
  browserSync.init({
    notify : false,
    server: '.tmp',
    port: config.port,
    open: 'external',
    middleware: middleware.concat(mockRouter)
  });
  gulp.watch("src/libs/**/**.*", ['libs']).on('change', function(event){
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
  // 监听js文件的变化，自动执行'script'任务
  gulp.watch("src/js/**.js", ['script']).on('change', function(event){
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
  // 监听css文件的变化，自动执行'css'任务
  gulp.watch(PATHS.styleCss, ['css']).on('change', function(event){
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
  // 监听less文件的变化，自动执行'less'任务
  gulp.watch(PATHS.styleLess, ['less']).on('change', function(event){
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
  // 监听images文件的变化，自动执行'images'任务
  gulp.watch('src/less/*.less', ['images']).on('change', function(event){
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
  //监听html文件的变化，自动重新载入
  gulp.watch('src/view/**.html', ['html']).on('change', browserSync.reload);
});

// 生产环境gulp任务
gulp.task('build', ['build-libs', 'build-html', 'build-css', 'build-less', 'build-images', 'build-script', 'eslint'], function() {
  console.log('打包完成！');
});

//默认启动的gulp任务数组['serve']
gulp.task('default', ['serve']);
