const Mock = require('mockjs');

module.exports = {
  port: 3000,
  PATHS: {
    entry: {
      html: 'src/**.html',
      images: 'src/images/**.*',
      less: 'src/styles/less/**.less',
      css: 'src/styles/css/**.css',
      js: 'src/js/**.js',
      libs: 'src/libs/**/**.*',
    },
    output: {
      dev: {
        html: '.tmp',
        images: '.tmp/images',
        less: '.tmp/styles/less',
        css: '.tmp/styles/css',
        js: '.tmp/js',
        libs: '.tmp/libs',
        rev: '.tmp/rev',
      },
      pro: {
        html: 'dist',
        images: 'dist/images',
        less: 'dist/styles/less',
        css: 'dist/styles/css',
        js: 'dist/js',
        libs: 'dist/libs',
      },
    },
  },
  proxys: [
    {
      host: 'http://rap.taobao.org/',
      path: '/mockjsdata',
    },
  ],
  router: [
    {
      route: '/api/mock',
      handle: (req, res, next) => {
        const data = Mock.mock({
          data: {
            'list|0-10': [
              {
                'id|+1': 0,
              },
            ],
          },
          status: 200,
          message: '',
          serverTime: '@now',
        });
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
        next();
      },
    },
  ],
};
