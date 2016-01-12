'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var mswebdeploy = require('./index.js');

it('should ', function (cb) {
    this.timeout(50000);
	var stream = mswebdeploy({ "source" : "node_modules"});

	stream.on('data', function (file) {
		assert.strictEqual(file.contents.toString(), 'unicorns');
	});

	stream.on('end', cb);

	stream.write(new gutil.File({
		base: __dirname,
		path: __dirname + '/file.ext',
		contents: new Buffer('unicorns')
	}));

	stream.end();
});
