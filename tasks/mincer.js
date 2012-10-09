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
  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerMultiTask('mince', 'Use mincer to concatenate your files.', function () {
    function toArray(strOrArray) {
      return Array.isArray(strOrArray) ? strOrArray : [strOrArray];
    }

    var options = this.data,
      include = toArray(options.include),
      src = options.src || this.target + '.js',
      dest = options.dest || path.join(options.destDir, this.target + '.js'),
      done = this.async();

    grunt.log.write('Generating file ' + dest.cyan + '...');
    grunt.helper('mince', src, dest, include, function(err) {
      if (err) {
        grunt.warn(err);
      } else {
        grunt.log.ok();
      }
      done();
    });
  });

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  grunt.registerHelper('mince', function(src, dest, include, fn) {
    var environment = new Mincer.Environment(process.cwd()),
      asset;

    include.forEach(function(include) {
      environment.appendPath(include);
    });

    asset = environment.findAsset(src);
    if (!asset) {
      return fn('Cannot find logical path: ' + src.cyan);
    }

    asset.compile(function (err) {
      if (err) {
        fn(err);
      } else {
        grunt.file.write(dest, asset.toString());
        fn();
      }
    });
  });
};
