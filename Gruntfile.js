/*jslint node: true */
module.exports = function (grunt) {
    'use strict';

    var scriptSrcPath = './src/js/',
        lessSrcPath = './src/less/',
        lessDestPath = './public/css/',
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
                    compress: true,
                    optimization: 3,
                    sourceMap: true,
                    sourceMapBasepath: lessSrcPath,
                    sourceMapFilename: lessDestPath + 'bootstrap.css.map',
                    sourceMapURL: 'bootstrap.css.map'
                },
                files: {
                    'public/css/bootstrap.css': lessSrcPath + 'bootstrap.less'
                }
            }
        },
        uglify: {
            lib: {
                options: {
                    mangle: false,
                    compress: true,
                    screwIE8: true,
                    sourceMap: true
                },
                files: {
                    'public/js/lib.min.js': libJsFiles
                }
            },
            main: {
                options: {
                    mangle: false,
                    compress: true,
                    screwIE8: true,
                    sourceMap: true
                },
                files: {
                    'public/js/main.min.js': mainJsFiles
                }
            }
        },
        nodemon: {
            dev: {
                script: 'src/node/index.js',
                options: {
                    args: ['dev'],
                    nodeArgs: ['--debug'],
                    delay: 1000,
                    watch: ['src/node/']
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
    grunt.loadNpmTasks('grunt-nodemon');

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