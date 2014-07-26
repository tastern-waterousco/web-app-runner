/**
 * A sample external configuration file with read functions to enable non-cached requires. As an
 * executable this offers much more flexibility than a standard json file.
 */

'use strict';

var Logger = require('simple-node-logger' );

module.exports.readConfig = function() {
    var config = {
        appkey:'',
        env:'staging',
        port:3005,
        daemon:true
    };

    var file = [ process.env.HOME, '/logs/staging-', config.port, '.log' ].join('');
    config.log = Logger.createSimpleFileLogger( file );

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

