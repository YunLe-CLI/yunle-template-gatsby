'use strict';
const path = require('path');
const NODE_ENV = process.env.NODE_ENV === 'production';

module.exports = {
  env: !NODE_ENV,
  port: NODE_ENV ? 3000 : 3000,
  proxys: [
    {
      host: 'http://rap.taobao.org/',
      path: '/mockjsdata',
    },
  ]
};
