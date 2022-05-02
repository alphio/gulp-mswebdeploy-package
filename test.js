'use strict';
var assert = require('assert');
var File = require('vinyl');
var mswebdeploy = require('./index.js');

it('should ', function (cb) {
    this.timeout(50000);
	var stream = mswebdeploy({ "source" : "node_modules"});

	stream.on('data', function (file) {
		assert.strictEqual(file.contents.toString(), 'unicorns');
	});

	stream.on('end', cb);

	stream.write(new File({
		base: __dirname,
		path: __dirname + '/file.ext',
		// Buffer() constructor is deprecated; use Buffer.from if available
		contents: (Buffer.from ? Buffer.from('unicorns') : new Buffer('unicorns'))
	}));

	stream.end();
});
