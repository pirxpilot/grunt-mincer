/*
 * grunt-mincer
 * https://github.com/pirxpilot/grunt-mincer
 *
 * Copyright (c) 2012 Damian Krzeminski
 * Licensed under the MIT license.
 */


var Mincer = require('mincer');

exports.init = function(grunt) {
  'use strict';

  var exports = {};

  exports.mince = function(src, dest, include, engines, configure) {
    var environment, asset, err;

    function configureEngine(name) {
      var engine = Mincer[name + 'Engine'] || Mincer[name],
        opts = engines[name];
      if (!engine || typeof engine.configure !== 'function') {
        err = 'Invalid Mincer engine ' + name.cyan;
        return true;
      }
      engine.configure(opts);
    }

    configure(Mincer);

    environment = new Mincer.Environment(process.cwd());
    include.forEach(function(include) {
      environment.appendPath(include);
    });

    if (Object.keys(engines).some(configureEngine)) {
      return err;
    }

    asset = environment.findAsset(src);
    if (!asset) {
      return 'Cannot find logical path ' + src.cyan;
    }
    grunt.file.write(dest, asset.toString());
  };

  return exports;
};
