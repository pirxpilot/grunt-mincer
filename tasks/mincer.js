/*
 * grunt-mincer
 * https://github.com/pirxpilot/grunt-mincer
 *
 * Copyright (c) 2012 Damian Krzeminski
 * Licensed under the MIT license.
 */

var path = require('path');
var Mincer = require('mincer');

module.exports = function(grunt) {

  // Please see the grunt documentation for more information regarding task and
  // helper creation: https://github.com/cowboy/grunt/blob/master/docs/toc.md

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerMultiTask('mince', 'Use mincer to concatenate your files.', function () {
    function toArray(strOrArray) {
      return Array.isArray(strOrArray) ? strOrArray : [strOrArray];
    }

    var options = this.data,
      done = this.async(),
      include = toArray(options.include),
      src = options.src || this.target + '.js',
      dest = options.dest || path.join(options.destDir, this.target + '.js'),
      asset,
      environment = new Mincer.Environment(process.cwd());

    include.forEach(function(include) {
      environment.appendPath(include);
    });

    asset = environment.findAsset(src);
    if (!asset) {
      grunt.warn('Cannot find logical path: ' + src);
    }

    asset.compile(function (err) {
      if (err) {
        grunt.warn(err);
      }

      grunt.file.write(dest, asset.toString());
      done();
    });
  });

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  grunt.registerHelper('mince', function() {
    return 'mince!!!';
  });

};
