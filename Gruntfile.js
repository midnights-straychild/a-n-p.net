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
            scriptSrcPath + 'lib/jquery-ui.js',
            scriptSrcPath + 'lib/bootstrap.js',
            scriptSrcPath + 'lib/angular.js',
            scriptSrcPath + 'lib/angular-route.js',
            scriptSrcPath + 'lib/starmap.js'
        ],

        mainJsFiles = [
            scriptSrcPath + 'controller/*.js',
            scriptSrcPath + '*.js',
            vendorSrcPath + 'starmap/js/*.js'
        ];

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: [
                './public/css/',
                './public/js/',
                './src/js/lib/',
                './vendor/'
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
                    vendorSrcPath + 'starmap/js/starmap.js',
                    vendorSrcPath + 'jquery-ui-1.11.4/jquery-ui.js'
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
                    compress: {
                        'drop_console': true
                    },
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
            'assets-image': {
                src: [
                    'http://content.eveonline.com/data/Tiamat_1.0_Icons.zip',
                    'http://content.eveonline.com/data/Tiamat_1.0_Types.zip'
                ],
                dest: 'cache/assets/img'
            },
            'vendor-js': {
                src: [
                    'http://jqueryui.com/resources/download/jquery-ui-1.11.4.zip'
                ],
                dest: 'cache/assets/js'
            }
        },
        unzip: {
            'assets-image': {
                src: 'cache/assets/img/*.zip',
                dest: 'public/assets/img/'
            },
            'vendor-js': {
                src: 'cache/assets/js/*.zip',
                dest: 'vendor/'
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
    grunt.loadNpmTasks('grunt-if-missing');

    grunt.registerTask('unpackDb', function () {
        var Decompress = require('decompress'),
            bzip2 = require('decompress-bzip2'),
            done = this.async(),

            decompressBzip2 = new Decompress()
                .src('./cache/db/eve.db.bz2')
                .dest('./assets/db')
                .use(bzip2());

        console.log('Files decompressing');

        decompressBzip2.run(function (err, files) {
            if (err) {
                done(false);
                throw err;
            }

            console.log('Files decompressed:');
            console.log(files);
            console.log('Files extracted successfully!');
            done();
        });

        return true;
    });

    grunt.registerTask('test', [
        'clean:build',
        'fetchVendors',
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

    grunt.registerTask('fetchVendors', [
        'gitclone',
        'if-missing:curl-dir:vendor-js',
        'unzip:vendor-js'
    ]);

    grunt.registerTask('fetchAssets', [
        'if-missing:curl-dir:assets-image',
        'unzip:assets-image',
        'if-missing:curl-dir:db',
        'unpackDb'
    ]);

    grunt.registerTask('install', [
        'fetchAssets',
        'fetchVendors',
        'minifyLessProd',
        'minifyJs',
        'test',
        'nodemon:prod'
    ]);

    grunt.registerTask('default', ['test']);
};