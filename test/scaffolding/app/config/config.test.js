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
  it('should env not empty', function() {
    expect(serverConfig.env).to.be.not.empty;
  });
  it('should env not empty', function() {
    expect(serverConfig.port).to.be.not.empty;
  });
  it('should proxy not empty', function() {
    expect(serverConfig.proxy).to.be.not.empty;
  });
  it('should proxy an object', function() {
    expect(serverConfig.proxy).to.be.an('object');
  });
  it('should proxy host an string', function() {
    expect(serverConfig.proxy.host).to.be.a('string');
  });
  it('should proxy path an string', function() {
    expect(serverConfig.proxy.path).to.be.a('string');
  });
});
