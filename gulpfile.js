/* eslint-disable */
const gulp = require('gulp');
const proxyMiddleware = require('http-proxy-middleware');
const browserSync = require('browser-sync').create();
const $ = require('gulp-load-plugins')();
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const pngquant = require('imagemin-pngquant');
const minimist = require('minimist');

const config = require('./config/server.config');
const PATHS = config.PATHS || {};
const entry = PATHS.entry || {};
const output = PATHS.output || {};
const router = config.router || [];
const proxys = config.proxys || [];

const errFun = { errorHandler: $.notify.onError('Error: <%= error.message %>') };
const imgBase64 = {
  maxImageSize: 20 * 1024,
  debug: true
};
const knownOptions = {
  string: 'env',
  default: { env: process.env.NODE_ENV || 'env' },
};
const autoConfig = { browsers: ['last 10 version'] };

const options = minimist(process.argv.slice(2), knownOptions);

// 自动编译html的任务
gulp.task('html', function () {
  return gulp.src(entry.html)
      .pipe($.plumber(errFun))
      .pipe($.changed(output.dev.html, { extension: '.html' }))
      .pipe($.htmlmin({
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
      }))
      .pipe(gulp.dest(output.dev.html))
      .pipe($.revAppend())
      .pipe(gulp.dest(output.dev.html));
});
gulp.task('build-html', function () {
  return gulp.src(entry.html)
      .pipe($.plumber(errFun))
      .pipe($.changed(output.pro.html, { extension: '.html' }))
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
});
gulp.task('build-less', function () {
  return gulp.src(entry.less)
      .pipe($.plumber(errFun))
      .pipe($.less())
      .pipe($.postcss([
        autoprefixer(autoConfig),
        cssnano(),
      ]))
      .pipe(gulp.dest(output.pro.less))
      .pipe($.base64(imgBase64))
      .pipe(gulp.dest(output.dev.less))
      .pipe(browserSync.stream());
});

// 自动编译css的任务
gulp.task('css', function () {
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
});
gulp.task('build-css', function () {
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
});
gulp.task('build-images', function () {
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
  return gulp.src(entry.js)
      .pipe($.plumber(errFun))
      .pipe($.changed(output.dev.js, { extension: '.js' }))
      .pipe($.babel({
        presets: ['es2015']
      }))
      .pipe(gulp.dest(output.dev.js));
});
gulp.task('build-script', function () {
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
  return gulp.src(entry.libs)
      .pipe($.plumber(errFun))
      .pipe(gulp.dest(output.dev.libs));
});
gulp.task('build-libs', function () {
  return gulp.src(entry.libs)
      .pipe($.plumber(errFun))
      .pipe(gulp.dest(output.pro.libs));
});

// 开发环境server
gulp.task('server', ['libs', 'less', 'css', 'images', 'script', 'html'], function () {
  const middleware = [];
  proxys.map(function (item) {
    middleware.push(proxyMiddleware(
      [item.path],
      { target: item.host, changeOrigin: true }));
  });
  browserSync.init({
    notify: false,
    server: '.tmp',
    port: config.port,
    open: 'external',
    middleware: middleware.concat(router),
  });
  gulp.watch(entry.libs, ['libs']).on('change', browserSync.reload);
  gulp.watch(entry.js, ['script']).on('change', browserSync.reload);
  gulp.watch(entry.less, ['less']);
  gulp.watch(entry.css, ['css']);
  gulp.watch(entry.images, ['images']).on('change', browserSync.reload);
  gulp.watch(entry.html, ['html']).on('change', browserSync.reload);
});

// 生产环境gulp任务
gulp.task('build', ['build-libs', 'build-less', 'build-css', 'build-images', 'build-script', 'build-html'], function() {
  console.info('打包生产环境成功!');
  const middleware = [];
  proxys.map(function (item) {
    middleware.push(proxyMiddleware(
      [item.path],
      { target: item.host, changeOrigin: true }));
  });
  browserSync.init({
    notify: false,
    server: 'dist',
    open: 'external',
    middleware: middleware.concat(router),
  });
});

// 默认启动的gulp任务数组['server']
gulp.task('default', ['server']);
