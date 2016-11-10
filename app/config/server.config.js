'use strict';
const path = require('path');

const NODE_ENV = process.env.NODE_ENV === 'production';
let host = 'localhost';
if (NODE_ENV) {
  host = 'usersMongo';
}

module.exports = {
  env: !NODE_ENV,
  port: NODE_ENV ? 3000 : 3000,
  proxy: {
    host: 'https://www.baidu.com/',
    path: '/s',
  }
};
