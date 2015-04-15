/*jslint node: true */
/*global module*/
module.exports = function (grunt) {
    'use strict';

    var scriptSrcPath = './src/js/',
        lessSrcPath = './src/less/',
        lessDestPath = './public/css/',
        nodeSrcPath = './node_modules/',
        vendorSrcPath = './vendor/',

        libJsFiles = [
            scriptSrcPath + 'lib/prototypes.js',
            scriptSrcPath + 'lib/jquery.js',
            scriptSrcPath + 'lib/bootstrap.js',
            scriptSrcPath + 'lib/angular.js',
            scriptSrcPath + 'lib/angular-route.js',
            scriptSrcPath + 'lib/starmap.js'
        ],

        mainJsFiles = [
            scriptSrcPath + '/controller/*.js',
            scriptSrcPath + '*.js'
        ];

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            install: [
                './public/css/',
                './public/js/',
                './src/js/lib/'
            ],
            cache: [
                './cache'
            ]
        },
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
                    nodeSrcPath + 'angular-route/angular-route.js',
                    nodeSrcPath + 'jquery/dist/jquery.js',
                    nodeSrcPath + 'bootstrap/dist/js/bootstrap.js'
                ],
                dest: 'src/js/lib'
            },
            vendorJs: {
                nonull: true,
                expand: true,
                flatten: true,
                src: [
                    vendorSrcPath + 'starmap/js/starmap.js'
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
        autoprefixer: {
            options: {
                browsers: ['last 2 versions', 'ie 9']
            },
            noDest: {
                src: 'public/css/bootstrap.css' // globbing is also possible here
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
        'curl-dir': {
            db: {
                src: [
                    'https://www.fuzzwork.co.uk/dump/scylla-1.111482/eve.db.bz2'
                ],
                dest: 'cache/db'
            },
            assets: {
                src: [
                    'http://content.eveonline.com/data/Tiamat_1.0_Icons.zip',
                    'http://content.eveonline.com/data/Tiamat_1.0_Types.zip'
                ],
                dest: 'cache/assets/'
            }
        },
        unzip: {
            'assets-image': {
                src: 'cache/assets/*.zip',
                dest: 'public/assets/img/'
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
        gulp: {
            decompressDb: function () {
                var gulp = require('gulp'),
                    bzip2 = require('decompress-bzip2'),
                    vinylAssign = require('vinyl-assign');

                return gulp.src('cache/db/*.bz2')
                    .pipe(vinylAssign({extract: true}))
                    .pipe(bzip2())
                    .pipe(gulp.dest('assets/db'));
            }
        },
        gitclone: {
            starmap: {
                options: {
                    repository: 'https://github.com/midnights-straychild/ovid.github.com.git',
                    directory: './vendor/starmap'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-curl');
    grunt.loadNpmTasks('grunt-zip');
    grunt.loadNpmTasks('grunt-if-missing');
    grunt.loadNpmTasks('grunt-gulp');
    grunt.loadNpmTasks('grunt-git');

    grunt.registerTask('test', [
        'jshint',
        'minifyJs',
        'minifyLessProd'
    ]);

    grunt.registerTask('minify', [
        'minifyJs',
        'minifyLess'
    ]);

    grunt.registerTask('minifyJs', [
        'jshint',
        'copy:libJs',
        'copy:vendorJs',
        'uglify:lib',
        'uglify:main'
    ]);

    grunt.registerTask('minifyLess', [
        'less:default',
        'autoprefixer'
    ]);

    grunt.registerTask('minifyLessProd', [
        'less:default',
        'autoprefixer'
    ]);

    grunt.registerTask('watchAll', [
        'watch'
    ]);
    grunt.registerTask('watchNode', [
        'nodemon:dev'
    ]);

    grunt.registerTask('fetchAssets', [
        'if-missing:curl-dir:assets',
        'unzip:assets-image',
        'if-missing:curl-dir:db',
        'gulp:decompressDb'
    ]);

    grunt.registerTask('install', [
        'gitclone',
        'fetchAssets',
        'minifyLessProd',
        'minifyJs',
        'test',
        'nodemon:prod'
    ]);

    grunt.registerTask('default', ['test']);
};