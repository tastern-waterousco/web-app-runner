#!/usr/bin/env node

var opts = {
    port:3006,
    logfile: __dirname + '/app-start.log',
    daemon:true,
    env:'production'
};

require('../lib/WebAppRunner').createInstance( opts );

