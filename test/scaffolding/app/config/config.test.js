var chai = require('chai');
var expect = chai.expect;
var chaiHttp = require('chai-http');
var should = chai.should();
chai.use(chaiHttp);

var serverConfig = require('../../../../app/config/server.config.js');

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
    expect(serverConfig.proxys).to.be.an('array');
  });
  context('proxys in array', function() {
    var proxys = serverConfig.proxys;
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
