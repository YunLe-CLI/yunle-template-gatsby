'use strict';
const Mock = require('mockjs');

module.exports = [
  {
    route: '/api/mock/',
    handle: function(req, res, next) {
      var data = Mock.mock({
        data: {
          'list|0-10': [
            {
              'id|+1': 0
            }
          ]
        },
        status: 200,
        message: "",
        serverTime: '@now'
      });
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(data));
      next();
    },
  },
];
