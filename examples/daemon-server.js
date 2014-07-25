#!/usr/bin/env node

var dash = require( 'lodash' ),
    args = dash.toArray( process.argv ),
    runner,
    command,
    opts = {
        port:3002,
        logfile: __dirname + '/daemon-server.log',
        env:'staging',
        daemon:true
    };

args.shift();

console.log( args );

if (args[ 1 ] === 'runDaemon') {
    console.log( 'run the web app, pid: ', process.pid );
    runner = require( '../lib/WebAppRunner' ).createInstance( opts );
} else {
    command = args[ 0 ];
    runner = require('background-service-runner' ).createDaemonRunner();
    child = runner.start( command, [ 'runDaemon' ] );

    console.log('child pid: ', child.pid );
}

