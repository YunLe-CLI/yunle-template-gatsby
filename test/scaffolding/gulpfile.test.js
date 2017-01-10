"use stirct";

const chai = require('chai');
const expect = chai.expect;
const spawn = require('child_process').spawn;
const should = chai.should();
const path = require('path');
const through = require('through2');

var gulpfile = require('../../gulpfile.js');

describe('should gulpfile.js', function() {
  it('should env not empty', function() {
    expect(gulpfile).to.be.empty;
  });
  context('Valid tasks', function() {
    // const tasks = {
  	// 	'html': '编译html的任务',
    //   'build-html': '生产环境-编译html的任务',
    //   'css': '编译css的任务',
    //   'build-css': '编译css的任务',
    //   'less': '编译less的任务',
    //   'build-less': '编译less的任务',
    //   'images': '编译images的任务',
    //   'build-images': '生产环境-自动编译images的任务',
    //   'script': '编译script的任务',
    //   'build-script': '生产环境-编译script的任务'
  	// };
    const tasks = {};
  	Object.keys(tasks).forEach((task) => {
  		it(tasks[task], (done) => {
  			const gulp = spawn('gulp', [task, '--gulpfile', path.join(__dirname, '../../gulpfile.js')]);

  			const indent = through((chunk, enc, cb) => {
  				cb(null, chunk.toString().replace(/^([^\t])/gm, '\t$1'));
  			});

  			gulp.stdout.pipe(indent).pipe(process.stdout);

  			gulp.on('exit', (code) => {
          expect(code).to.be.equal(0);
  				done();
  			});
  		});
  	});

  });
});
