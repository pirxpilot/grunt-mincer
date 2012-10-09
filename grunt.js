module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    clean: {
      test: ['tmp']
    },
    nodeunit: {
      files: ['test/**/*.js']
    },
    lint: {
      files: ['grunt.js', 'tasks/**/*.js', 'test/**/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'default'
    },
    mince: {
      main: {
        include: ['test/fixtures', 'test/fixtures/lib'],
        destDir: 'tmp'
      },
      full: {
        include: ['test/fixtures', 'test/fixtures/lib'],
        src: 'main.js',
        dest: 'tmp/full.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        es5: true
      },
      globals: {}
    }
  });

  // Load local tasks.
  grunt.loadTasks('tasks');

  // The clean plugin helps in testing.
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.renameTask('test', 'nodeunit');
  grunt.registerTask('test', 'clean mince nodeunit');

  // Default task.
  grunt.registerTask('default', 'lint test');
};
