/*jslint node: true */
module.exports = function (grunt) {
    'use strict';

    var scriptSrcPath = './src/js/',
        lessSrcPath = './src/less/',
        lessDestPath = './public/css/',
        nodeSrcPath = './node_modules/',

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
            libJs: {
                nonull: true,
                expand: true,
                flatten: true,
                src: [
                    nodeSrcPath + 'angular/angular.js',
                    nodeSrcPath + 'angular-route/angular-*.js',
                    nodeSrcPath + 'jquery/dist/jquery.js',
                    nodeSrcPath + 'bootstrap/dist/js/bootstrap.js'
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
            },
            prod: {
                script: 'src/node/index.js',
                options: {
                    args: ['prod']
                }
            }
        },
        watch: {
            js: {
                files: mainJsFiles,
                tasks: ['minifyJs'],
                options: {
                    spawn: false
                }
            },
            less: {
                files: lessSrcPath + '**',
                tasks: ['minifyLess'],
                options: {
                    spawn: false
                }
            }
        },
        fetchAssets: {

        }
    });grunt

    grunt.loadNpmTasks('grunt-npm-install');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-curl');
    grunt.loadNpmTasks('grunt-zip');

    grunt.registerTask('test', [
        'jshint'
    ]);

    grunt.registerTask('minify', [
        'minifyJs',
        'minifyLess'
    ]);

    grunt.registerTask('minifyJs', [
        'jshint',
        'copy:libJs',
        'uglify:lib',
        'uglify:main'
    ]);

    grunt.registerTask('minifyLess', [
        'less:default'
    ]);

    grunt.registerTask('watchAssets', [
        'watch'
    ]);
    grunt.registerTask('watchNode', [
        'nodemon:dev'
    ]);

    grunt.registerTask('install', [
        'npm-install',
        'test',
        'minify',
        'nodemon:prod'
    ]);

    grunt.registerTask('default', ['test']);
};