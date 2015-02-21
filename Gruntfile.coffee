module.exports = (grunt) ->
  
  config =

    pkg: (grunt.file.readJSON('package.json'))

    coffeelint:
      daemon: ['src/**/*.coffee', 'test/**/*.coffee']

    coffee:
      daemon:
        expand: true,
        flatten: false,
        cwd: 'src',
        src: ['./**/*.coffee'],
        dest: 'dist',
        ext: '.js'
      test:
        expand: true,
        flatten: false,
        cwd: 'test',
        src: ['./**/*.coffee'],
        dest: 'test',
        ext: '.js'
    
    mochaTest:
      options:
        reporter: 'spec'
        src: ['test/**/*.js']

    clean:
      daemon: ['dist', 'test/**/*.js']

    watch:
      files: ['src/**/*.coffee', 'test/**/*.coffee'],
      tasks: ['test']
      configFiles:
        files: ['Gruntfile.coffee']
        options:
          reload: true

  grunt.initConfig config
    
  grunt.loadNpmTasks 'grunt-coffeelint'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-mocha-test'

  grunt.registerTask 'compile', ['coffeelint', 'clean', 'coffee']
  grunt.registerTask 'test', ['compile', 'mochaTest']