/*global module */
/* jslint node: true */
module.exports = function (grunt) {
    'use strict';

    var scriptSrcPath = './src/js/',
        scriptDestPath = './js/',
        lessSrcPath = './src/less/',
        lessDestPath = './css/',
        vendorSrcPath = './vendor/',

        urlBase = 'localhost/',

        libJsFiles = [
            scriptSrcPath + 'lib/*.js',
            vendorSrcPath + 'twitter/bootstrap/js/*.js'
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
                    'node_modules/angular/angular.min.js',
                    'node_modules/angular/angular.min.js.gzip',
                    'node_modules/angular/angular.min.js.map'
                ],
                dest: 'js/'
            }
        },
        less: {
            bootstrapcore: {
                options: {
                    cleancss: true,
                    compile: true,
                    yuicompress: true,
                    sourceMap: true,
                    sourceMapFilename: lessDestPath + 'bootstrap-core.css.map',
                    sourceMapURL: '/css/bootstrap-core.css.map',
                    sourceMapRootPath: urlBase,
                    sourceMapBasepath: urlBase
                },
                files: {
                    'css/bootstrap-core.css': lessSrcPath + 'bootstrap-core.less'
                }
            },
            bootstrap: {
                options: {
                    cleancss: true,
                    compile: true,
                    yuicompress: true,
                    sourceMap: true,
                    sourceMapFilename: lessDestPath + 'bootstrap.css.map',
                    sourceMapURL: '/css/bootstrap.css.map',
                    sourceMapRootPath: urlBase,
                    sourceMapBasepath: urlBase
                },
                files: {
                    'css/bootstrap.css': lessSrcPath + 'bootstrap.less'
                }
            }
        },
        uglify: {
            lib: {
                options: {
                    mangle: {
                        except: ['jQuery', '$', '_', 'PB', 'pbsc', 'Spinner']
                    },
                    compress: true,
                    sourceMap: scriptDestPath + 'lib.min.js.map',
                    sourceMappingURL: urlBase + 'js/lib.min.js.map',
                    sourceMapPrefix: 3,
                    sourceMapRoot: urlBase + 'js/'
                },
                files: {
                    'js/lib.min.js': libJsFiles
                }
            },
            main: {
                options: {
                    mangle: {
                        except: ['jQuery', '$', '_', 'PB', 'pbsc', 'Spinner']
                    },
                    compress: true,
                    sourceMap: scriptDestPath + 'main.min.js.map',
                    sourceMappingURL: urlBase + 'js/main.min.js.map',
                    sourceMapPrefix: 3,
                    sourceMapRoot: urlBase + 'js/'
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
                files: lessSrcPath + '*.less',
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
        'minify-js',
        'minify-less'
    ]);

    grunt.registerTask('minifyJs', [
        'jshint',
        'copy:angular',
        'uglify:lib',
        'uglify:main'
    ]);

    grunt.registerTask('minifyLess', [
        'less:bootstrapcore',
        'less:bootstrap'
    ]);
};