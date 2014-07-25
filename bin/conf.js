/**
 * a sample external configuration file with read functions to enable non-cached requires...
 */

'use strict';

var Logger = require('simple-node-logger' );

module.exports.readConfig = function() {
    var config = {
        env:'staging',
        port:3005,
        log: Logger.createSimpleFileLogger( process.env.HOME + '/logs/staging-3005.log'),
        daemon:true
    };

    return config;
};

module.exports.readFilters = function() {
    var filters = {};

    filters.ip = {
        accept:[ ],
        reject:[ ]
    };

    filters.agent = {
        accept:[ ],
        reject:[ ]
    };

    return filters;
};

