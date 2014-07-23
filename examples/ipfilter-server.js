#!/usr/bin/env node

var opts = { 
        port:3001,
        whiteList:[
            '127.0.0.1',
            '10.1.10.10'
        ],
        blackList:[
            '127.9.9.9',
            '10.1.10.144'
        ]
    }, 
    runner = require( '../lib/WebAppRunner' ).createInstance( opts );

runner.start();

