/*
 * grunt-mincer
 * https://github.com/pirxpilot/grunt-mincer
 *
 * Copyright (c) 2012 Damian Krzeminski
 * Licensed under the MIT license.
 */


var Mincer = require('mincer');

exports.init = function (grunt) {
  'use strict';

  var exports = {};

  exports.mince = function (options, callback) {
    var environment, asset, err;

    function configureEngine(name) {
      var engine = Mincer[name + 'Engine'] || Mincer[name],
        opts = options.engines[name];
      if (!engine || typeof engine.configure !== 'function') {
        err = 'Invalid Mincer engine ' + name.cyan;
        return true;
      }
      engine.configure(opts);
    }

    options.configure(Mincer);

    environment = new Mincer.Environment(process.cwd());

    if (options.minifyjs) {
      environment.jsCompressor = "uglify";
    }

    if (options.minifycss) {
      environment.cssCompressor = "csso";
    }

    options.include.forEach(function (include) {
      environment.appendPath(include);
    });

    Object.keys(options.helpers).forEach(function (key) {
      environment.registerHelper(key, options.helpers[key]);
    });

    if (Object.keys(options.engines).some(configureEngine)) {
      callback(err);
      return;
    }

    if (options.manifestPath && options.manifestPath.length > 0) {
      var manifest = new Mincer.Manifest(environment, options.manifestPath);
      manifest.compile([options.src], function (err) {
        callback(err);
      });
      return;
    }

    asset = environment.findAsset(options.src);
    if (!asset) {
      callback('Cannot find logical path ' + options.src.cyan);
      return;
    }
    grunt.file.write(options.dest, asset.toString());
    callback();
  };

  return exports;
};