/*
 * grunt-sequelize
 * https://github.com/webcast-io/grunt-sequelize
 *
 * Copyright (c) 2013 Ben Evans
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {

      options: {
        jshintrc: '.jshintrc',
        ignores: [
          '*.min.js',
          'node_modules/**/*',
          'public/js/components/**',
          'coverage/**'
        ]
      },
      all: [
        '*.js',
        '**/*.js'
      ]

    },

    mochaTest: {
      test: {
        options: {
          reporter: 'dot',
        },
        src: ['test/**.js']
      }
    },

  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('mocha', ['mochaTest']);
  grunt.registerTask('test', ['mocha']);

  if(process.env.TEST_CMD) {
    grunt.registerTask('travis', process.env.TEST_CMD);
  }

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
