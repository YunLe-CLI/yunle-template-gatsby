/* eslint-disable */
const gulp = require('gulp');
const proxyMiddleware = require('http-proxy-middleware');
const browserSync = require('browser-sync').create();
const $ = require('gulp-load-plugins')();
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const pngquant = require('imagemin-pngquant');
const minimist = require('minimist');
const runSequence = require('run-sequence');
const Mock = require('mockjs');


const serverConfig = require('./config/server.config');
const gulpConfig = require('./config/_config');
const PATHS = gulpConfig.PATHS || {};
const entry = PATHS.entry || {};
const output = PATHS.output || {};
const router = serverConfig.router.dev || [];
const proxys = serverConfig.proxys.dev || [];

const errFun = { errorHandler: $.notify.onError('Error: <%= error.message %>') };
const imgBase64 = {
  maxImageSize: 30 * 1024,
  debug: true
};
const knownOptions = {
  string: 'env',
  default: { env: process.env.NODE_ENV || 'env' },
};
const autoConfig = { browsers: ['last 10 version'] };

const options = minimist(process.argv.slice(2), knownOptions);
const env = options.env || 'development';
console.log('编译环境: ', $.util.colors.magenta(env));
console.log('              ')
// 自动编译html的任务
gulp.task('html', function () {
  if (env === 'development') {
    return gulp.src(entry.html)
        .pipe($.plumber(errFun))
        .pipe($.changed(output.dev.html, { extension: '.html' }))
        .pipe($.htmlReplace({
          config: {
            src: 'window.__ENV__ = "development";',
            tpl: '<script>%s</script>'
          }
        }))
        .pipe($.htmlmin({
          removeEmptyAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
        }))
        .pipe(gulp.dest(output.dev.html))
        .pipe($.revAppend())
        .pipe(gulp.dest(output.dev.html));
  }
  return gulp.src(entry.html)
      .pipe($.plumber(errFun))
      .pipe($.changed(output.pro.html, { extension: '.html' }))
      .pipe($.htmlReplace({
        config: {
          src: 'window.__ENV__ = "production";',
          tpl: '<script>%s</script>'
        }
      }))
      .pipe($.htmlmin({
        removeComments: true,
        collapseWhitespace: true,
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyJS: true,
        minifyCSS: true,
      }))
      .pipe(gulp.dest(output.pro.html))
      .pipe($.revAppend())
      .pipe(gulp.dest(output.pro.html));
});

// 自动编译less的任务
gulp.task('less', function () {
  if (env === 'development') {
    return gulp.src(entry.less)
        .pipe($.plumber(errFun))
        .pipe($.less())
        .pipe($.postcss([
          autoprefixer(autoConfig),
        ]))
        .pipe(gulp.dest(output.dev.less))
        .pipe($.base64(imgBase64))
        .pipe(gulp.dest(output.dev.less))
        .pipe(browserSync.stream());
  }
  return gulp.src(entry.less)
      .pipe($.plumber(errFun))
      .pipe($.less())
      .pipe($.postcss([
        autoprefixer(autoConfig),
        cssnano(),
      ]))
      .pipe(gulp.dest(output.pro.less))
      .pipe($.base64(imgBase64))
      .pipe(gulp.dest(output.pro.less))
      .pipe(browserSync.stream());
});

// 自动编译css的任务
gulp.task('css', function () {
  if (env === 'development') {
    return gulp.src(entry.css)
        .pipe($.plumber(errFun))
        .pipe($.changed(output.dev.css, { extension: '.css' }))
        .pipe($.postcss([
          autoprefixer(autoConfig),
        ]))
        .pipe(gulp.dest(output.dev.css))
        .pipe($.base64(imgBase64))
        .pipe(gulp.dest(output.dev.css))
        .pipe(browserSync.stream());
  }
  return gulp.src(entry.css)
      .pipe($.plumber(errFun))
      .pipe($.changed(output.pro.css, { extension: '.css' }))
      .pipe($.postcss([
        autoprefixer(autoConfig),
        cssnano(),
      ]))
      .pipe(gulp.dest(output.pro.css))
      .pipe($.base64(imgBase64))
      .pipe(gulp.dest(output.pro.css))
      .pipe(browserSync.stream());
});

// 压缩图片任务
gulp.task('images', function () {
  if (env === 'development') {
    return gulp.src(entry.images)
        .pipe($.plumber(errFun))
        .pipe($.changed(output.dev.images))
        .pipe($.cache($.imagemin({
          optimizationLevel: 3,
          progressive: true,
          interlaced: true,
          multipass: true,
          svgoPlugins: [{ removeViewBox: false }],
          use: [pngquant()],
        })))
        .pipe(gulp.dest(output.dev.images));
  }
  return gulp.src(entry.images)
      .pipe($.plumber(errFun))
      .pipe($.changed(output.pro.images))
      .pipe($.cache($.imagemin({
        optimizationLevel: 3,
        progressive: true,
        interlaced: true,
        multipass: true,
        svgoPlugins: [{ removeViewBox: false }],
        use: [pngquant()],
      })))
      .pipe(gulp.dest(output.pro.images));
});

// 压缩 js 文件
gulp.task('script', function () {
  if (env === 'development') {
    return gulp.src(entry.js)
        .pipe($.plumber(errFun))
        .pipe($.changed(output.dev.js, { extension: '.js' }))
        .pipe($.babel({
          presets: ['es2015']
        }))
        .pipe(gulp.dest(output.dev.js));
  }
  return gulp.src(entry.js)
      .pipe($.plumber(errFun))
      .pipe($.changed(output.pro.js, { extension: '.js' }))
      .pipe($.babel({
        presets: ['es2015']
      }))
      .pipe($.uglify())
      .pipe(gulp.dest(output.pro.js));
});

gulp.task('libs', function () {
  if (env === 'development') {
    return gulp.src(entry.libs)
        .pipe($.plumber(errFun))
        .pipe(gulp.dest(output.dev.libs));
  }
  return gulp.src(entry.libs)
      .pipe($.plumber(errFun))
      .pipe(gulp.dest(output.pro.libs));
});

// 开发环境server
gulp.task('server', ['init'], function () {
  const middleware = [];
  proxys.map(function (item) {
    middleware.push(proxyMiddleware(
      [item.path],
      { target: item.host, changeOrigin: true, pathRewrite: item.pathRewrite }));
  });
  browserSync.init({
    notify: false,
    server: '.tmp',
    open: 'external',
    middleware: middleware.concat(router),
  });
  gulp.watch(entry.libs, ['libs'])
      .on('change', browserSync.reload)
  gulp.watch(entry.js, ['script'])
      .on('change', browserSync.reload);
  gulp.watch(entry.less, ['less']);
  gulp.watch(entry.css, ['css']);
  gulp.watch(entry.images, ['images'])
      .on('change', browserSync.reload);
  gulp.watch(entry.html, ['html'])
      .on('change', browserSync.reload);
});

// 生产环境gulp任务
gulp.task('build', ['init'], function() {
  console.log($.util.colors.magenta('打包生产环境成功!'));

  const middleware = [];
  proxys.map(function (item) {
    middleware.push(proxyMiddleware(
      [item.path],
      { target: item.host, changeOrigin: true, pathRewrite: item.pathRewrite }));
  });
  router.map(function (item) {
    middleware.push({
      route: item.route,
      handle: function (req, res) {
        if (item.mockData) {
          const data = Mock.mock(item.mockData);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
          return;
        }
        item.handle ? item.handle(req, res) : null;
      },
    });
  });
  const routerMiddleware =
  browserSync.init({
    notify: false,
    server: 'dist',
    open: 'external',
    middleware: middleware.concat(router),
  });
});

gulp.task('init', function(callback) {
  runSequence('libs', 'images', ['script', 'less', 'css'], 'html', callback);
});

// 默认启动的gulp任务数组['server']
gulp.task('default', ['server']);
