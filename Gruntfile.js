/*global module */
/* jslint node: true */
module.exports = function (grunt) {
    'use strict';

    var scriptSrcPath = './src/js/',
        lessSrcPath = './src/less/',
        lessDestPath = './',
        vendorSrcPath = './vendor/',

        libJsFiles = [
            scriptSrcPath + 'lib/jquery.js',
            scriptSrcPath + 'lib/bootstrap.js',
            scriptSrcPath + 'lib/angular.js',
            scriptSrcPath + 'lib/angular-*.js'
        ],

        mainJsFiles = [
            scriptSrcPath + '*.js'
        ];

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            gruntfile: {
                src: ['./Gruntfile.js']
            },
            all: [scriptSrcPath + '*.js'],

            options: {
                jshintrc: '.jshintrc'
            }
        },
        copy: {
            angular: {
                nonull: true,
                expand: true,
                flatten: true,
                src: [
                    'node_modules/angular/angular.js',
                    'node_modules/angular-route/angular-*.js'
                ],
                dest: 'src/js/lib'
            },
            jquery: {
                nonull: true,
                expand: true,
                flatten: true,
                src: [
                    'node_modules/jquery/dist/jquery.js'
                ],
                dest: 'src/js/lib'
            },
            bootstrap: {
                nonull: true,
                expand: true,
                flatten: true,
                src: [
                    vendorSrcPath + 'twitter/bootstrap/dist/js/bootstrap.js'
                ],
                dest: 'src/js/lib'
            }
        },
        less: {
            default: {
                options: {
                    cleancss: true,
                    compile: true,
                    yuicompress: true,
                    sourceMap: true,
                    sourceMapBasepath: lessSrcPath,
                    sourceMapFilename: lessDestPath + 'bootstrap.css.map'
                },
                files: {
                    'css/bootstrap.css': lessSrcPath + 'bootstrap.less'
                }
            }
        },
        uglify: {
            lib: {
                options: {
                    mangle: false,
                    compress: false,
                    screwIE8: true,
                    sourceMap: true
                },
                files: {
                    'js/lib.min.js': libJsFiles
                }
            },
            main: {
                options: {
                    mangle: false,
                    compress: false,
                    screwIE8: true,
                    sourceMap: true
                },
                files: {
                    'js/main.min.js': mainJsFiles
                }
            }
        },
        watch: {
            minifyJs: {
                files: mainJsFiles,
                tasks: ['minifyJs'],
                options: {
                    spawn: false
                }
            },
            minifyLess: {
                files: lessSrcPath + '**',
                tasks: ['minifyLess'],
                options: {
                    spawn: false
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-npm-install');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('test', ['jshint']);

    grunt.registerTask('minify', [
        'minifyJs',
        'minifyLess'
    ]);

    grunt.registerTask('minifyJs', [
        'jshint',
        'copy',
        'uglify:lib',
        'uglify:main'
    ]);

    grunt.registerTask('minifyLess', [
        'less:default'
    ]);
};