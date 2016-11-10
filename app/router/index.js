'use strict';
const Router = require('koa-router');
const proxy = require('koa-proxy');
const config = require('../config/server.conf');

const routes = new Router();
routes.get('/', function* () {
  yield this.render('index', {
    text: 'hello wold!',
  });
});

// 代理路由
routes.all(`${config.proxy.path}`, proxy({
  host: config.proxy.host,
}));
routes.all(`${config.proxy.path}/*`, proxy({
  host: config.proxy.host,
}));
module.exports = routes;
