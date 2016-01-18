'use strict';
var gutil       = require('gulp-util');
var through     = require('through2');
var fileSystem  = require("fs");
var archiver    = require('archiver');
var mkdirp      = require('mkdirp');
var builder     = require('xmlbuilder');
var _           = require("lodash");
var colors      = require("colors");

function generateManifestXml(options){
    var system_info_xml = builder.create(
      {'msdeploy.iisApp': {
        'iisApp' : {
          '@path' : options.source
        }

        }
      }).end({ pretty: true});

    return system_info_xml;
}

function generateParametersXml(options){
    var archive_xml = builder.create({"parameters" : {
    }

    }).end({ pretty: true});
     return archive_xml;
}

function createPackage(options, callback) {
      gutil.log("Starting...".green);

        if( !_.endsWith(options.source, '/') ){
          options.source = options.source + "/";
        }

        if(!_.endsWith(options.dest, '/') ){
          options.dest = options.dest + "/";
        }

      if(options.enabled){
        mkdirp(options.dest, function(err) {
            gutil.log("WARNING: Failed to create folder '".yellow + options.dest.red.bold + "' or the directory already exists.".yellow);
        });

        gutil.log('Creating web deploy package "' + options.dest.magenta + options.package.magenta.bold + '" from the directory "' + options.source.magenta + '"');

        var output = fileSystem.createWriteStream(options.dest + options.package);
        var archive = archiver('zip');
        gutil.log("Archiving...".yellow);

        output.on('close', function () {
          gutil.log(archive.pointer() + ' total bytes');
          gutil.log("Package '" + options.dest.magenta + options.package.magenta.bold + ", created");
          callback();
        });

        archive.on('error', function(err){
            gutil.log(err.toString().red);
            callback();
        });

        archive.pipe(output);
        archive.directory(options.source);
        archive.append(generateParametersXml(options), { name:'parameters.xml' });
        archive.append( generateManifestXml(options), { name:'manifest.xml' });
        archive.finalize();
      }
  }

module.exports = function (options) {

    
	if (!options.verb) {
		options.verb = "sync";
	}
    
    if (!options.dest) {
		options.dest = "webdeploy/";
	}
    
    if (!options.source) {
		options.source = "dist/";
	}
    
    if (!options.package) {
		options.package = "webdeploy.zip";
	}
    
    if (!options.enabled) {
		options.enabled = true;
	}
    
    if (!options.includeAcls) {
		options.includeAcls = true;
	}

	return through.obj(function (file, enc, callback) {
        gutil.log('Initializing...');  
        
        if (file.isStream()) {
            throw gutil.PluginError("gulp-mswebdeploy-package", "Stream is not supported");
            return callback();
        }
      
        createPackage(options, callback);
	});
};
