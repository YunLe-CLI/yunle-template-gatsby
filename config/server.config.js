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
      host: 'http://rap.taobao.org',
      path: '/api/rap',
      pathRewrite: { '^/api/rap': 'mockjsdata' },
    },
  ],
  router: [
    {
      route: '/api/mock',
      handle: (req, res) => {
        const data = Mock.mock({
          data: {
            'status|0-1': 0,
            conditions: {
              workNum: 10,
              followsNum: 10,
              fansNum: 10,
            },
            nowStats: {
              'workNum|0-20': 0,
              'followsNum|0-20': 0,
              'fansNum|0-20': 0,
            },
            userInfo: [{
              avatar: "@image('200x200', '#50B347', '#FFF', '白猫')",
              nickname: '@csentence(3, 10)',
            }],
            'isOk|0-1': 0,
          },
          'status|200-201': 200,
          message: '@sentence(10, 25)',
          serverTime: '@now',
        });
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
      },
    },
  ],
};
