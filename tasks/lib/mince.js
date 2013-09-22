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

  exports.mince = function(src, dest, include, configurator) {
    var environment = new Mincer.Environment(process.cwd()),
      asset;

    include.forEach(function(include) {
      environment.appendPath(include);
    });

    if (configurator) { configurator(Mincer); }

    asset = environment.findAsset(src);
    if (asset) {
      grunt.file.write(dest, asset.toString());
      return true;
    }

  };

  return exports;
};
