module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    clean: {
      test: ['tmp']
    },
    nodeunit: {
      files: ['test/**/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'default'
    },
    mince: {
      main: {
        options: {
          include: ['test/fixtures', 'test/fixtures/lib'],
        },
        files: [
          { src: 'test/fixtures/main.js', dest: 'tmp/', flatten: true, expand: true }
        ]
      },
      full: {
        options: {
          include: ['test/fixtures', 'test/fixtures/lib']
        },
        files: [{
          src: 'test/fixtures/main.js',
          dest: 'tmp/full.js'
        }]
      },
      extended: {
        options: {
          include: ['test/fixtures', 'test/fixtures/lib'],
          engines: {
            'Coffee': {bare: true},
            'Stylus': function() {}
          }
        },
        files: [{
          src: 'test/fixtures/main.js',
          dest: 'tmp/extended.js',
        }]
      },
      manifest: {
        options: {
          manifestPath: 'tmp/manifest/manifest.json',
          manifestOptions: {
            compress: false,
            sourceMaps: true,
            embedMappingComments: true
          },
          include: ['test/fixtures', 'test/fixtures/lib'],
        },
        files: [{
          src: 'test/fixtures/main.css.less',
          dest: 'tmp/main.css'
        }]
      },
      helpers: {
        options: {
          include: 'test/fixtures',
          helpers: {
            version: function() { return '3.2.1'; }
          }
        },
        files: [{
          src: 'test/fixtures/version.js.ejs',
          dest: 'tmp/version.js'
        }]
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'tasks/**/*.js', 'test/**/*_test.js'],
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
        globals: {}
      },
    }
  });

  // Load mince task
  grunt.loadTasks('tasks');

  // Load contrib tasks
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'mince', 'nodeunit']);

  // Default task.
  grunt.registerTask('default', ['jshint', 'test']);
};
