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
  }
};
