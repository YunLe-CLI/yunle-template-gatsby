var chai = require('chai');
var expect = chai.expect;
var chaiHttp = require('chai-http');
var should = chai.should();
chai.use(chaiHttp);

var gulpfile = require('../gulpfile.js');
var serverConfig = require('../app/config/server.config.js');
var router = require('../app/router/API.mock.js');

describe('gulpfile.js', function() {
  it('should env not empty', function() {
    expect(gulpfile).to.be.empty;
  });
});

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
  it('should proxy object', function() {
    expect(serverConfig.proxy).to.be.an('object');
  });
});

describe('app/router/API.mock.js', function() {
  it('should array', function() {
    expect(router).to.be.an('array');
  });
});
