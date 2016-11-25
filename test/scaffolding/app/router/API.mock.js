var chai = require('chai');
var expect = chai.expect;
var chaiHttp = require('chai-http');
var should = chai.should();
chai.use(chaiHttp);

var router = require('../../../../app/router/API.mock.js');

describe('app/router/API.mock.js', function() {
  it('should array', function() {
    expect(router).to.be.an('array');
  });
  it('should array item an object', function() {
    expect(router[0]).to.be.an('object');
  });
  it('should array item router an strong', function() {
    expect(router[0].route).to.be.not.empty;
    expect(router[0].handle).to.be.an('function');
  });
});
