# gulp-mswebdeploy [![Build Status](https://travis-ci.org/nhambayi/gulp-mswebdeploy.svg?branch=master)](https://travis-ci.org/nhambayi/gulp-mswebdeploy)

> My fantastic gulp plugin


## Install

```
$ npm install --save-dev gulp-mswebdeploy
```


## Usage

```js
var gulp = require('gulp');
var mswebdeploy = require('gulp-mswebdeploy');

gulp.task('default', function () {
	return gulp.src('src/file.ext')
		.pipe(mswebdeploy())
		.pipe(gulp.dest('dist'));
});
```


## API

### mswebdeploy(options)

#### options

##### foo

Type: `boolean`  
Default: `false`

Lorem ipsum.


## License

MIT © [NOAH HAMBAYI](https://github.com/nhambayi)
