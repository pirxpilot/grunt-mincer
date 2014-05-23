/*
 * grunt-mincer
 * https://github.com/pirxpilot/grunt-mincer
 *
 * Copyright (c) 2012 Damian Krzeminski
 * Licensed under the MIT license.
 */

var Mincer = require('mincer'),
  path = require('path');

exports.init = function (grunt) {
  'use strict';

  var exports = {};

  var arrayUnique = function (value, index, self) {
    return self.indexOf(value) === index;
  };

  var logicalAssetName = function(environment, filename) {
    var engines = environment.getEngines();

    var parts = path.basename(filename).split('.');
    while(engines.hasOwnProperty('.' + parts.slice(-1)[0])) {
      parts.pop();
    }
    return parts.join('.');
  };

  var mince = function (src, options) {
    var environment, asset, err;

    function configureEngine(name) {
      var engine = Mincer[name + 'Engine'] || Mincer[name],
        opts = options.engines[name];
      if (!engine || typeof engine.configure !== 'function') {
        grunt.fail.warn('Invalid Mincer engine ' + name.cyan);
      }
      engine.configure(opts);
    }

    options.configure(Mincer);

    environment = new Mincer.Environment(process.cwd());

    [].concat(options.include).forEach(function (include) {
      environment.appendPath(include);
    });
    environment.appendPath(path.dirname(src));

    Object.keys(options.helpers).forEach(function (key) {
      // Create a bound function which has access to the current Mincer.Environment
      var helper = options.helpers[key].bind({
        environment: environment
      });
      environment.registerHelper(key, helper);
    });

    if (Object.keys(options.engines).some(configureEngine)) {
      return;
    }

    if (options.jsCompressor) {
      environment.jsCompressor = options.jsCompressor;
    }

    if (options.cssCompressor) {
      environment.cssCompressor = options.cssCompressor;
    }

    if (options.manifestPath && options.manifestPath.length > 0) {
      var resolvedAssets = src.map(function(filepath) {
        return logicalAssetName(environment, filepath);
      });
      var manifest = new Mincer.Manifest(environment, options.manifestPath);
      return manifest.compile(resolvedAssets);
    }

    asset = environment.findAsset(path.basename(src));
    if (!asset) {
      grunt.fail.warn('Cannot find logical path ' + src.cyan);
    }
    return asset.toString();
  };

  exports.compileManifest = function(files, options) {
    var inputFiles = [],
      includePaths = options.include;

    files.forEach(function(file) {
      inputFiles = inputFiles.concat(file.src.map(function(filepath) {
        return path.basename(filepath);
      }));
      includePaths = includePaths.concat(file.src.map(function(filepath) {
        return path.dirname(filepath);
      }));
    });

    options.include = includePaths.filter(arrayUnique);

    if (options.banner) {
      grunt.log.warn('Banner option is not supported when compiling to manifest.');
    }

    var assetData = mince(inputFiles.filter(arrayUnique), options);
    if(typeof assetData === 'object') {
      if (options.verbose && assetData.assets) {
        Object.keys(assetData.assets).forEach(function (src) {
          grunt.log.writeln('File ' + src + ' written to: ' + assetData.assets[src]);
        });
      } else {
        grunt.log.writeln('Manifest written to: ' + options.manifestPath.cyan);
      }
    } else {
      grunt.fail.warn('Error compiling manifest:' + options.manifestPath.cyan);
    }
  };

  exports.compileAssets = function(files, options) {
    files.forEach(function (file) {
      var output = [];
      var valid = file.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file ' + filepath.cyan + ' not found.');
          return false;
        } else {
          return true;
        }
      });

      valid.forEach(function (file) {
        var assetData = mince(file, options);
        output.push(assetData);
      });

      if (output.length === 0) {
        return grunt.log.warn('Destination not written because compiled output was empty');
      }

      if (options.banner) {
        output.unshift(options.banner + grunt.util.linefeed);
      }

      grunt.file.write(file.dest, output.join(''));
      grunt.log.writeln('File ' + file.dest.cyan + ' created...');
    });
  };

  return exports;
};