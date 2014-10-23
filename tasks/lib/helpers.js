/*
 * grunt-mincer
 * https://github.com/pirxpilot/grunt-mincer
 *
 * Copyright (c) 2012 Damian Krzeminski
 * Licensed under the MIT license.
 */

var Mincer = require('mincer'),
  path = require('path'),
  SourceMapConsumer = require('source-map').SourceMapConsumer,
  SourceNode = require('source-map').SourceNode;

exports.init = function (grunt) {
  'use strict';

  var exports = {};

  var arrayUnique = function (value, index, self) {
    return self.indexOf(value) === index;
  };

  var logicalAssetName = function(environment, filename) {
    var engines = environment.getEngines(),
      resolvedFilename = path.resolve(filename),
      _path, _i, _len;

    for (_i = 0, _len = environment.paths.length; _i < _len; _i++) {
      _path = environment.paths[_i];
      if(_path.slice(-1, 1) !== path.sep) {
        _path += path.sep;
      }
      if(resolvedFilename.slice(0, _path.length) === _path) {
        resolvedFilename = resolvedFilename.slice(_path.length);
        break;
      }
    }
    var parts = resolvedFilename.split('.');
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

    if (options.enable) {
      [].concat(options.enable).forEach(function (configuration) {
        environment.enable(configuration);
      });
    }

    [].concat(options.include).forEach(function (include) {
      environment.appendPath(include);
    });
    [].concat(src)
      .map(function (src) { return path.dirname(src); })
      .filter(arrayUnique)
      .forEach(function (src) { environment.appendPath(src); });
    environment.appendPath(process.cwd());

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

      if ((options.manifestOptions.sourceMaps !== null) && options.manifestOptions.sourceMaps) {
        environment.enable('source_maps');
      }

      var manifest = new Mincer.Manifest(environment, options.manifestPath);
      return manifest.compile(resolvedAssets, options.manifestOptions);
    }

    asset = environment.findAsset(src);
    if (!asset) {
      grunt.fail.warn('Cannot find logical path ' + src.cyan);
    }
    return asset;
  };

  exports.compileManifest = function(files, options) {
    var inputFiles = [];

    files.forEach(function(file) {
      inputFiles = inputFiles.concat(file.src.map(function(filepath) {
        return filepath;
      }));
    });

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
      var sourceNode = new SourceNode();
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
        sourceNode.add(options.banner);
        sourceNode.add(grunt.util.linefeed);
      }

      output.forEach(function(asset) {
        if(asset.sourceMap && asset.sourceMap.mappings !== '') {
          sourceNode.add(SourceNode.fromStringWithSourceMap(asset.toString(), new SourceMapConsumer(asset.sourceMap)));
        } else {
          asset.toString().split('\n').forEach(function(line, j){
            sourceNode.add(new SourceNode(j + 1, 0, asset.relativePath, line + '\n'));
          });
          sourceNode.add('\n');
        }
      });

      if([].concat(options.enable).indexOf('source_maps') > -1) {
        var mapUrl = options.sourceMappingURL(options, file);
        if (/\.css$/.test(file.dest)) {
          sourceNode.add('/*# sourceMappingURL=' + mapUrl + ' */');
        } else {
          sourceNode.add('//# sourceMappingURL=' + mapUrl);
        }
      }

      var mappedOutput = sourceNode.toStringWithSourceMap({
        file: file.dest,
        sourceRoot: ''
      });

      grunt.file.write(file.dest, mappedOutput.code.toString());
      grunt.log.writeln('File ' + file.dest.cyan + ' created...');

      if([].concat(options.enable).indexOf('source_maps') > -1) {
        var mapFile = file.dest + '.map';
        grunt.file.write(mapFile, mappedOutput.map.toString());
        grunt.log.writeln('File ' + mapFile.cyan + ' created...');
      }
    });
  };

  return exports;
};
