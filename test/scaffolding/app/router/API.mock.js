var chai = require('chai');
var expect = chai.expect;
var chaiHttp = require('chai-http');
var should = chai.should();
var httpMocks = require('node-mocks-http');
var request = {}; // define REQUEST
var response = {}; // define RESPONSE
chai.use(chaiHttp);

var mockAPI = require('../../../../app/router/API.mock.js');

describe('app/router/API.mock.js', function() {
  context('Valid response', function() {
    beforeEach(function(done) {
      request = httpMocks.createRequest({
        method: 'GET',
        url: '/test/path?myid=312',
        query: {
            myid: '312'
        }
      });
      response = httpMocks.createResponse();
      done();
    });
    it('should response is array', function() {
      expect(mockAPI).to.be.an('array');
    });
    for (var i = 0; i < mockAPI.length; i++) {
      var thatRouter = mockAPI[i];
      it('should array item an object --' + thatRouter.route, function() {
        expect(thatRouter).to.be.an('object');
      });
      it('should array item router an strong --' + thatRouter.route, function() {
        expect(thatRouter.route).to.be.not.empty;
        expect(thatRouter.handle).to.be.an('function');
      });
      it('should get mockApi not empty --' + thatRouter.route, function(done) {
        thatRouter.handle(request, response, function(error) {
          if (error) {
            throw new Error('Expected not to receive an error');
          }
          expect(response._getData()).to.be.not.empty;
          done();
        })
      });
      it('should get mockApi JSON --' + thatRouter.route, function(done) {
        thatRouter.handle(request, response, function(error) {
          if (error) {
            throw new Error('Expected not to receive an error');
          }
          var data = JSON.parse(response._getData());
          expect(data).to.be.an('object');
          expect(data.status).to.be.a('number');
          expect(data.message).to.be.empty;
          done();
        })
      });
    }
  });

});
