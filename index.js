'use strict';
var gutil       = require('gulp-util'),
    through     = require('through2'),
    fileSystem  = require("fs"),
    archiver    = require('archiver'),
    mkdirp      = require('mkdirp'),
    builder     = require('xmlbuilder'),
    _           = require("lodash"),
    colors      = require("colors");

function generateManifestXml(options){
    var system_info_xml = builder.create({
      'msdeploy.iisApp': {
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

function validateOption(opts, error, callback) {
    
    if(opts == null || opts == 'undefined') {
      error();
    }
    
    if( !_.endsWith(opts.source, '/') ) {
          options.source = options.source + "/";
        }

    if(!_.endsWith(options.dest, '/') ) {
      options.dest = options.dest + "/";
    }
    
    if(options.enabled === 'true'){
      options.enabled == true;
    }
};

function log(message) {
  gutil.log(message);
}


function createPackage(options, callback) {
    gutil.log("==============================".green);
    gutil.log("*        ".green 
      + "Open Web Deploy".red 
      + "     *".green);
    gutil.log("==============================".green);

    if( !_.endsWith(options.source, '/') ){
      options.source = options.source + "/";
    }

    if(!_.endsWith(options.dest, '/') ){
      options.dest = options.dest + "/";
    }

    if(!options.enabled) {
      gutil.log("Disabled. Skipping deployment...".green);
    }
    else {
      gutil.log("Creating deployment package...".green);
      
      mkdirp(options.dest, function(err) {
        log(err);
        log("WARNING: Failed to create folder '".yellow 
        + options.dest.red.bold 
        + "' or the directory already exists.".yellow);
      });

      log('Creating web deploy package "' 
        + options.dest.magenta + options.package.magenta.bold 
        + '" from the directory "' 
        + options.source.magenta + '"');

      var output = fileSystem.createWriteStream(options.dest + options.package);
      var archive = archiver('zip');
      gutil.log("Archiving...".yellow);

      output.on('close', function () {
        var archiveSize = (archive.pointer() / 1024).toFixed(0);
        archiveSize = archiveSize.replace(/./g, function(c, i, a) {
                return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
            }) + ' Kilobytes';
            
        gutil.log("Web deploy package '" 
        + options.dest.magenta + options.package.magenta.bold 
        + ", created." 
        + " ("
        + archiveSize
        + ")");
        

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
        }
      
        createPackage(options, callback);
	});
};
