/**
 * a sample external configuration file with read functions to enable non-cached requires...
 */

'use strict';

module.exports.readConfig = function() {
    var config = {
        env:'staging',
        port:3005,
        logfile: process.env.HOME + '/logs/app-start.log',
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

