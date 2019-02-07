var webpackConfig = require('./webpack.config');

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        availabletasks: {
            tasks: {
                options: {
                    filter: 'exclude',
                    tasks: ['availabletasks', 'default']
                }
            }
        },
        webpack: {
            main: webpackConfig,
        }
    });

// Load the plugin that provides the tasks.
    require('load-grunt-tasks')(grunt);
    grunt.registerTask('default', ["availabletasks"]);
};