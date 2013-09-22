/*
 * grunt-mincer
 * https://github.com/pirxpilot/grunt-mincer
 *
 * Copyright (c) 2012 Damian Krzeminski
 * Licensed under the MIT license.
 */


var path = require('path');

module.exports = function(grunt) {
  'use strict';

  var mince = require('./lib/mince').init(grunt).mince;

  grunt.registerMultiTask('mince', 'Use mincer to concatenate your files.', function () {
    function toArray(strOrArray) {
      return Array.isArray(strOrArray) ? strOrArray : [strOrArray];
    }

    var options = this.data,
      include = toArray(options.include),
      src = options.src || this.target + '.js',
      helpers = options.helpers || {},
      engines = options.engines || {},
      configure = options.configure || function() {},
      dest = options.dest || path.join(options.destDir, this.target + '.js'),
      err;

    grunt.log.write('Generating file ' + dest.cyan + '...');
    err = mince(src, dest, include, helpers, engines, configure);
    if (err) {
      grunt.warn(err);
    } else {
      grunt.log.ok();
    }
  });
};
