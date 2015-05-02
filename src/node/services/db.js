/*jslint node: true */
var sqlite3 = require('sqlite3'),
    config = require('../config.json'),
    db,

    getDB = function () {
        'use strict';
        if (db === undefined) {
            db = new sqlite3.Database(config.dbPath);
        }

        return db;
    },

    getFromTable = function (table, callback) {
        'use strict';
        var rows = [],
            i = 0;

        db = getDB();

        db.each(
            'SELECT * FROM ' + table,
            function (err, row) {
                if (err) {
                    console.log(err);
                }

                rows[i] = row;
                i += 1;
            },
            function (err) {
                if (err) {
                    console.log(err);
                }

                callback(rows);
            }
        );
    },

    getFromTableWhere = function (table, where, callback) {
        'use strict';
        var key,
            whereString,
            sql,
            whereParams = [];

        if (where !== undefined) {
            for (key in where) {
                whereString = key + ' = ? ';
                whereParams.push(where[key]);
            }
            whereString = ' WHERE ' + whereString;
        }

        sql = 'SELECT * FROM ' + table + whereString;

        db = getDB();

        db.all(
            sql,
            whereParams,
            function (err, rows) {
                if (err) {
                    console.log(err);
                }

                callback(rows);
            }

        );
    };

exports.getDB = getDB;
exports.getFromTable = getFromTable;
exports.getFromTableWhere = getFromTableWhere;