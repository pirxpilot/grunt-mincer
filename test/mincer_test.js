'use strict';
var grunt = require('grunt');

exports.mince = {
  'mince': function(test) {
    test.expect(3);

    var expected = grunt.file.read('test/expected/main.js');
    var actual = grunt.file.read('tmp/main.js');
    test.equal(expected, actual, 'should mince, without src, with destDir in config');

    actual = grunt.file.read('tmp/full.js');
    test.equal(expected, actual, 'should mince, with src and dest in config');

    actual = grunt.file.read('tmp/extended.js');
    test.equal(expected, actual, 'should mince with engines params');

    test.done();
  },

  'mince relative': function(test) {
    test.expect(1);

    var expected = "function external() {}\n;";
    var actual = grunt.file.read('tmp/external.js').trim();
    test.equal(expected, actual, 'should find files given with relative path');

    test.done();
  },

  'mince manifest': function(test) {
    test.expect(4);

    var manifest = grunt.file.readJSON('tmp/manifest/manifest.json');
    test.ok(manifest.assets, 'manifest is valid');
    test.ok(manifest.files, 'manifest is valid');
    test.equal(manifest.assets['main.js'].indexOf('main-'), 0, 'generated asset name starts with original asset name');
    test.equal(manifest.assets['lib/external.js'].indexOf('lib/external-'), 0, 'subdirectory structure is honored in manifest');

    test.done();
  },

  'mince manifestmap': function(test) {
    test.expect(4);

    var manifest = grunt.file.readJSON('tmp/manifest/manifest.json');
    test.ok(manifest.assets, 'manifest is valid');
    test.ok(manifest.files, 'manifest is valid');
    test.equal(manifest.assets['main.css'].indexOf('main-'), 0, 'generated asset name starts with original asset name');

    var expected = grunt.file.read('test/expected/main.css.map');
    var actual = grunt.file.read('tmp/manifest/' + manifest.assets['main.css'] + '.map');
    test.equal(expected, actual, 'should generate source map');

    test.done();
  },

  'mince helpers': function(test) {
    test.expect(1);

    var expected = 'console.log("Version: 3.2.1");';
    var actual = grunt.file.read('tmp/version.js').trim();
    test.equal(expected, actual, 'should use mince helpers in EJS');

    test.done();
  }
};
