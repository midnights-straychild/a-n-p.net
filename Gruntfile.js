/*jslint node: true */
/*global module*/
module.exports = function (grunt) {
    'use strict';

    var scriptSrcPath = './src/js/',
        lessSrcPath = './src/less/',
        lessDestPath = './public/css/',
        nodeSrcPath = './node_modules/',

        libJsFiles = [
            scriptSrcPath + 'lib/prototypes.js',
            scriptSrcPath + 'lib/jquery.js',
            scriptSrcPath + 'lib/bootstrap.js',
            scriptSrcPath + 'lib/angular.js',
            scriptSrcPath + 'lib/angular-route.js'
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
                    nodeSrcPath + 'angular-route/angular-route.js',
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
        uncss: {
            dist: {
                files: {
                    'public/css/bootstrap.css': [
                        'public/index.html',
                        'pages/home.html',
                        'pages/contact.html',
                        'pages/about.html',
                        'pages/impressum.html'
                    ]
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
                    'http://cdn1.eveonline.com/data/Tiamat_1.0_110751_db.zip'
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
            },
            db: {
                src: 'cache/db/*.zip',
                dest: 'assets/db/'
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
    grunt.loadNpmTasks('grunt-uncss');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-curl');
    grunt.loadNpmTasks('grunt-zip');

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
        'uglify:lib',
        'uglify:main'
    ]);

    grunt.registerTask('minifyLess', [
        'less:default'
    ]);

    grunt.registerTask('minifyLessProd', [
        'less:default',
        'uncss',
        'autoprefixer'
    ]);

    grunt.registerTask('watchAll', [
        'watch'
    ]);
    grunt.registerTask('watchNode', [
        'nodemon:dev'
    ]);

    grunt.registerTask('fetchAssets', [
        'curl-dir:assets',
        'unzip:assets-image',
        'curl-dir:db',
        'unzip:db'
    ]);

    grunt.registerTask('install', [
        'fetchAssets',
        'minifyLessProd',
        'minifyJs',
        'test',
        'nodemon:prod'
    ]);

    grunt.registerTask('default', ['test']);
};