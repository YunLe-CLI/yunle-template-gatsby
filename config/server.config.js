module.exports = {
  proxys: {
    dev: [
      {
        host: 'http://rap.taobao.org',
        path: '/api/rap',
        pathRewrite: { '^/api/rap': 'mockjsdata' },
      },
    ],
    pro: [],
  },
  router: {
    dev: [
      {
        route: '/api/mock/checkV2',
        mockData: {
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
        },
        handle: (req, res, ctx) => {
          // ctx只在正试环境中使用
          // ctx.body = 123;
        },
      },
    ],
    pro: [],
  },
};
