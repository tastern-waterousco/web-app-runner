# Web App Runner
- - -

A simple HTTP server targeted for single-page web applications.

## Overview

Simple HTTP server that implements middleware for banning or re-routing authorized connections based on ip, agent or other requiest attributes. The server can be used stand alone or as middleware for connect or express.

_NOTE: this server is designed to deliver simple HTML applications that connect to alternate services.  It has a bit more features when compared with http-server, but isn't intended to be a full REST-type back-end._

## Installation

	npm install web-app-runner --save

## Use

There are various levels of authentication that can be applied ranging from completely open to finely filtered.  The very basic server can be launched in a few lines of code while more robust applications include loggers, accept/reject list files, configuration files, etc. 

### Minimal Web Server

A minimal server running on port 3000 from a root public folder that has index.html:

    // by default the server returns public/index.html
	require('web-app-runner').createInstance().start();

### Basic Server

Adding options and middleware gives you a bit more flexibility:

	var opts = {},
		runner;
	
	opts.port = 3002;
	opts.env = 'staging';
	opts.home = './';
	
	runner = require('web-app-runner').createInstance( opts );
	runner.createApp().use( someMiddleWare() );
	
	runner.start();
    
### Production Web Server

This example shows a more realistic environment where the environment is set to production, configuration is read from a file and the server runs as a cluster of services in a background daemon.

	// IP & agent accept/reject lists defined in config
	var configFile = __dirname + '/config.js',
    	logfile = process.env.HOME + '/logs/web-app.log',
    	log = require('simple-node-logger').createRollingFileLogger( logfile ),
    	opts = { 
        	log:log,
        	env:'production',
        	port:18004,
        	home:'./public',
        	daemon:true,
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

IP filters work on lists of regular expressions for accepting and rejecting specific addresses or address ranges.  The process first checks the accept list and allows access if there is a match.  If the accept list is not matched, then the reject list is checked.  When a reject list match is detected the user is sent to the specified reject URL.

The process first checks the accept list, then the reject list.

	var opts = {
			ip:{
				accept:[
					/^127\.0\.0\.1/,
					/^173\.13\.151\.1/
				],
				reject:[
					/^193\.144\.151\.1/,
					/^193\.144\.151\.2/
				],
				acceptUnkownVisitor:true
			}
		},
		runner = require('web-app-runner').createInstance( opts );
		
	runner.start();
	
Or better yet, define the accept and reject lists in the config file and set the refresh rate.  This way, the lists are refreshed when they change.

### Agent Filter

Agent filters work on lists of regular expressions.  The process first checks the accept list and allows access if there is a match.  If the accept list is not matched, then the reject list is checked.  When a reject list match is detected the user is sent to the specified reject URL.  

	var opts = {
			agent:{
				accept:[
					/chrome/[23][0-9]/,
					/msie 1[0-1]/,
					/safari/[7-8]/,
					/safari/534/
				],
				reject:[
					/msie [2-9]/,
					/safari/[2-5]/
					/chrome/2[0-6]/
					/chrome/1[0-9]/
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
<p><small><em>Copyright © 2014, rain city software | Version 0.90.23</em></small></p>
