#!/usr/bin/env node

var log = require('simple-node-logger').createSimpleLogger( __dirname + '/daemon-server.log' ),
    opts = {
        port:3002,
        daemon:true
    },
    runner = require( '../lib/WebAppRunner' ).createInstance( opts );

runner.start();

