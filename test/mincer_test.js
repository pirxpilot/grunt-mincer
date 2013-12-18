var grunt = require('grunt');

exports['mince'] = {
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

  'mince manifest': function(test) {
    test.expect(3);

    var manifest = grunt.file.readJSON('tmp/manifest/manifest.json');
    test.ok(manifest.assets, 'manifest is valid');
    test.ok(manifest.files, 'manifest is valid');
    test.equal(manifest.assets['main.js'].indexOf('main-'), 0, 'generated asset name starts with original asset name');

    test.done();
  },

  'mince helpers': function(test) {
    test.expect(1);

    var expected = 'console.log("Version: 3.2.1");\n';
    var actual = grunt.file.read('tmp/version.js');
    test.equal(expected, actual, 'should use mince helpers in EJS');

    test.done();
  }
};
