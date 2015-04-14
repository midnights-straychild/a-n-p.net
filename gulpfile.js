/*jslint node: true */

var gulp = require('gulp'),
    Decompress = require('decompress'),
    bzip2 = require('decompress-bzip2');

gulp.task('default', function () {
    // place code for your default task here
});

gulp.task('decompress-assets', function () {
    'use strict';
    var decompress = new Decompress()
        .src('foo.jpg.bz2')
        .dest('dest')
        .use(bzip2());

    decompress.run(function (err) {
        if (err) {
            throw err;
        }

        console.log('Files extracted successfully!');
    });
});