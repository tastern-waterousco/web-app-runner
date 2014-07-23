# Web App Runner
- - -

A simple HTTP server targeted for single-page web applications.

## Overview

Simple HTTP server that implements middleware for banning or re-routing authorized connections based on ip, agent or other requiest attributes. The server can be used stand alone or as middleware for connect or express.

_NOTE: this server is designed to deliver simple HTML applications that connect to alternate services.  It has a bit more features when compared with http-server, but isn't intended to be a full REST-type back-end._

## Installation

	npm install web-app-runner --save

## Use

There are various levels of authentication that can be applied ranging from completely open to finely filtered.  The very basic server can be launched in a few lines of code while more robust applications include loggers, white/black list files, configuration files, etc. 

### Basic Web Server

    // by default the server returns public/index.html
	var runner = require('web-app-runner').createInstance();

    runner.start();
    
### Production Web Server

	var configFile = __dirname + '/config.json',
    	logfile = process.env.HOME + '/logs/web-app.log',
    	log = require('simple-node-logger').createRollingFileLogger( logfile ),
    	opts = { 
        	log:log,
        	env:'production',
        	port:18004,
        	home:'./',
        	whiteListFile:__dirname + '/whitelist.json',
        	blackListFile:__dirname + '/blacklist.json',
        	runAsDaemon:true,
        	clustered:true
    	},
    	favicon = require('serve-favicon'),
    	connect = require('connect'),  
    	runner = require('web-app-runner').createInstance( opts ),
    	app = runner.createApp();
    
    // use additional middleware
    app.use( favicon( home + /favicon.png ) );
    
	runner.start();

### IP Filter

The following IP Filter server with accept and reject specific IP addresses.  All unknown IPs are accepted.  This is modified with the __acceptUnknownVisitor__ option parameter set to false.

IP filters work on lists of regular expressions for accepting and rejecting specific addresses or address ranges.  The process first checks the white list and allows access if there is a match.  If the white list is not matched, then the black list is checked.  When a black list match is detected the user is sent to the specified reject URL.

The process first checks the white list, then the black list.

	var opts = {
			ip:{
				whiteList:[
					'127.0.0.1',
					'173.13.151.[1-127]'
				],
				blackList:[
					'193.144.151.180'
				],
				acceptUnkownVisitor:true
			}
		},
		runner = require('web-app-runner').createInstance( opts );
		
	runner.start();
	
Or better yet, define the white and black lists in files and set the refresh rate.  This way, the lists are refreshed when the lists change.

### Agent Filter

Agent filters work on lists of regular expressions.  The process first checks the white list and allows access if there is a match.  If the white list is not matched, then the black list is checked.  When a black list match is detected the user is sent to the specified reject URL.  

	var opts = {
			agent:{
				whiteList:[
					'chrome/[23][0-9]',
					'msie 1[0-1]',
					'safari/[7-8]',
					'safari/534'
				],
				blackList:[
					'msie [2-9]',
					'safari/[2-5]
					'chrome/2[0-6]'
					'chrome/1[0-9]'
				],
				acceptUnkownAgent:true,
				rejectURL:'/browser-not-supported.html'
			}
		},
		runner = require('web-app-runner').createInstance( opts );
		
	runner.start();

## Tests

Tests are in place for all implemented methods. Tests are written in mocha/chai/should and include jshint rules.  To run the tests, do this:

	make test
	
## Examples
	
- - -
<p><small><em>Copyright © 2014, rain city software | Version 0.90.18</em></small></p>
