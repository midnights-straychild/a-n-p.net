/*global module */
/* jslint node: true */
module.exports = function (grunt) {
    'use strict';

    var SCRIPT_SRC_PATH = './src/js/',
        SCRIPT_DEST_PATH = './js/',
        LESS_SRC_PATH = './src/less/',
        LESS_DEST_PATH = './css/',
        VENDOR_SRC_PATH = './vendor/',

        URL_BASE = 'localhost/',

        LIB_JS_FILES = [
            SCRIPT_SRC_PATH + 'lib/*.js',
            VENDOR_SRC_PATH + 'twitter/bootstrap/js/*.js'
        ],

        MAIN_JS_FILES = [
            SCRIPT_SRC_PATH + '*.js'
        ];

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            gruntfile: {
                src: ['./Gruntfile.js']
            },
            all: [SCRIPT_SRC_PATH + '*.js'],

            options: {
                jshintrc: '.jshintrc'
            }
        },
        less: {
            bootstrapcore: {
                options: {
                    cleancss: true,
                    compile: true,
                    yuicompress: true,
                    sourceMap: true,
                    sourceMapFilename: LESS_DEST_PATH + 'bootstrap-core.css.map',
                    sourceMapURL: '/css/bootstrap-core.css.map',
                    sourceMapRootPath: URL_BASE,
                    sourceMapBasepath: URL_BASE
                },
                files: {
                    'css/bootstrap-core.css': LESS_SRC_PATH + 'bootstrap-core.less'
                }
            },
            bootstrap: {
                options: {
                    cleancss: true,
                    compile: true,
                    yuicompress: true,
                    sourceMap: true,
                    sourceMapFilename: LESS_DEST_PATH + 'bootstrap.css.map',
                    sourceMapURL: '/css/bootstrap.css.map',
                    sourceMapRootPath: URL_BASE,
                    sourceMapBasepath: URL_BASE
                },
                files: {
                    'css/bootstrap.css': LESS_SRC_PATH + 'bootstrap.less'
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
                    sourceMap: SCRIPT_DEST_PATH + 'lib.min.js.map',
                    sourceMappingURL: URL_BASE + 'js/lib.min.js.map',
                    sourceMapPrefix: 3,
                    sourceMapRoot: URL_BASE + 'js/'
                },
                files: {
                    'js/lib.min.js': LIB_JS_FILES
                }
            },
            main: {
                options: {
                    mangle: {
                        except: ['jQuery', '$', '_', 'PB', 'pbsc', 'Spinner']
                    },
                    compress: true,
                    sourceMap: SCRIPT_DEST_PATH + 'main.min.js.map',
                    sourceMappingURL: URL_BASE + 'js/main.min.js.map',
                    sourceMapPrefix: 3,
                    sourceMapRoot: URL_BASE + 'js/'
                },
                files: {
                    'js/main.min.js': MAIN_JS_FILES
                }
            }
        },
        watch: {
            minifyJs: {
                files: MAIN_JS_FILES,
                tasks: ['minifyJs'],
                options: {
                    spawn: false
                }
            },
            minifyLess: {
                files: LESS_SRC_PATH + '*.less',
                tasks: ['minifyLess'],
                options: {
                    spawn: false
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('test', ['jshint']);
    grunt.registerTask('minify', ['minify-js', 'minify-less']);
    grunt.registerTask('minifyJs', ['jshint', 'uglify:lib', 'uglify:main']);
    grunt.registerTask('minifyLess', ['less:bootstrapcore', 'less:bootstrap']);
};