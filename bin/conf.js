/**
 * A sample external configuration file with read functions to enable non-cached requires. As an
 * executable this offers much more flexibility than a standard json file.
 */

'use strict';

var Logger = require('simple-node-logger' ),
    port = 3005;

module.exports.readConfig = function() {
    var config = {
        appkey:'d551900c-146a-11e4-aaa3-df58755e84a9',
        env:'staging',
        port:port,
        daemon:true
    };

    return config;
};

module.exports.readLoggerConfig = function() {
    // define a rolling logger
    var config = {
        logDirectory: process.env.HOME + '/logs',
        fileNamePattern:[ 'staging-', port, '-<DATE>.log' ].join(''),
        dateFormat:'YYYY.MM.DD',
        level:'info',
        refresh:2 // re-read this config each minutes
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

