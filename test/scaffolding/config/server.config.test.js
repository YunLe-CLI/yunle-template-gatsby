var chai = require('chai');
var expect = chai.expect;
var chaiHttp = require('chai-http');
var httpMocks = require('node-mocks-http');
var should = chai.should();
chai.use(chaiHttp);

var serverConfig = require('../../../config/server.config.js');
var router = serverConfig.router;
// console.log(router)

describe('app/config/server.config.js', function() {
  it('should object', function() {
    expect(serverConfig).to.be.an('object');
  });
  it('should port not empty', function() {
    expect(serverConfig.port).to.be.not.empty;
  });
  it('should port a Number', function() {
    expect(serverConfig.port).to.be.a('number');
  });
  it('should proxys not empty', function() {
    expect(serverConfig.proxys).to.be.not.empty;
  });
  it('should proxys an array', function() {
    expect(serverConfig.proxys.dev).to.be.an('array');
    expect(serverConfig.proxys.pro).to.be.an('array');
  });
  context('proxys[dev] in array', function() {
    var proxys = serverConfig.proxys.dev;
    for (var i = 0; i < proxys.length ; i++) {
      var proxy = proxys[i];
      it('should proxy host an string ' + proxy.host, function() {
        expect(proxy.host).to.be.a('string');
      });
      it('should proxy path an string ' + proxy.path, function() {
        expect(proxy.path).to.be.a('string');
      });
    }
  });
  context('proxys[pro] in array', function() {
    var proxys = serverConfig.proxys.pro;
    for (var i = 0; i < proxys.length ; i++) {
      var proxy = proxys[i];
      it('should proxy host an string ' + proxy.host, function() {
        expect(proxy.host).to.be.a('string');
      });
      it('should proxy path an string ' + proxy.path, function() {
        expect(proxy.path).to.be.a('string');
      });
    }
  });

});

// describe('app/router/API.mock.js', function() {
//   context('Valid response', function() {
//     beforeEach(function(done) {
//       request = httpMocks.createRequest({
//         method: 'GET',
//         url: '/test/path?myid=312',
//         query: {
//             myid: '312'
//         }
//       });
//       response = httpMocks.createResponse();
//       done();
//     });
//     it('should response is array', function() {
//       expect(router).to.be.an('array');
//     });
//     for (var i = 0; i < router.length; i++) {
//       var thatRouter = router[i];
//       it('should array item an object --' + thatRouter.route, function() {
//         expect(thatRouter).to.be.an('object');
//       });
//       it('should array item router an strong --' + thatRouter.route, function() {
//         expect(thatRouter.route).to.be.not.empty;
//         expect(thatRouter.handle).to.be.an('function');
//       });
//       it('should get mockApi not empty --' + thatRouter.route, function(done) {
//         thatRouter.handle(request, response, function(error) {
//           if (error) {
//             throw new Error('Expected not to receive an error');
//           }
//           expect(response._getData()).to.be.not.empty;
//           done();
//         })
//       });
//       it('should get mockApi JSON --' + thatRouter.route, function(done) {
//         thatRouter.handle(request, response, function(error) {
//           if (error) {
//             throw new Error('Expected not to receive an error');
//           }
//           var data = JSON.parse(response._getData());
//           expect(data).to.be.an('object');
//           expect(data.status).to.be.a('number');
//           expect(data.message).to.be.empty;
//           done();
//         })
//       });
//     }
//   });
// });
