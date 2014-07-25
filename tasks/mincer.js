/*
 * grunt-mincer
 * https://github.com/pirxpilot/grunt-mincer
 *
 * Copyright (c) 2012 Damian Krzeminski
 * Licensed under the MIT license.
 */

module.exports = function (grunt) {
  'use strict';

  var path = require('path'),
    helpers = require(path.join(__dirname, 'lib/helpers')).init(grunt);

  grunt.registerMultiTask('mince', 'Use mincer to concatenate your files.', function () {
    var options = this.options({
      include: [],
      enable: [],
      manifestPath: '',
      manifestOptions: {
        compress: true,
        sourceMaps: true,
        embedMappingComments: true
      },
      sourceMappingBaseURL: '',
      helpers: {},
      engines: {},
      jsCompressor: null,
      cssCompressor: null,
      configure: function () {},
    });

    if(options.manifestPath !== '') {
      helpers.compileManifest(this.files, options);
    } else {
      helpers.compileAssets(this.files, options);
    }
  });
};
