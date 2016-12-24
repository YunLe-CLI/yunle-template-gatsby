module.exports = {
  port: 3000,
  proxys: [
    {
      host: 'http://rap.taobao.org/',
      path: '/mockjsdata',
    },
  ],
};
