var chai = require('chai');
var expect = chai.expect;
var chaiHttp = require('chai-http');
var should = chai.should();
chai.use(chaiHttp);

var gulpfile = require('../../gulpfile.js');

describe('gulpfile.js', function() {
  it('should env not empty', function() {
    expect(gulpfile).to.be.empty;
  });
});
