# Web App Runner
- - -

A simple HTTP server targeted for single-page web applications.

## Overview

Simple HTTP server that implements middleware for banning or re-routing authorized connections based on ip, agent or other requiest attributes. The server can be used stand alone or as middleware for connect or express.

## Installation

	npm install web-app-runner --save

## Use

There are various levels of authentication that can be applied ranging from completely open to finely filtered.

### Basic Web Server

    // by default the server returns public/index.html
	var runner = require('web-app-runner').createInstance();

    runner.start();

### IP Filter

The following IP Filter server with accept and reject specific IP addresses.  All unknown IPs are accepted.  This is modified with the __acceptUnknownVisitor__ option parameter set to false.

	var opts = {
			ip:{
				whiteList:[
					'127.0.0.1',
					'173.13.151.170'
				],
				blackList:[
					'173.14.151.180'
				],
				acceptUnkownVisitor:true
			}
		},
		runner = require('web-app-runner').createInstance( opts );
		
	runner.start();
	
Or better yet, define the white and black lists in files and set the refresh rate.  This way, the lists are refreshed when the lists change.

## Tests

Tests are in place for all implemented methods. Tests are written in mocha/chai/should and include jshint rules.  To run the tests, do this:

	make test
	

	
- - -
<p><small><em>Copyright © 2015, rain city software | Version 0.90.16</em></small></p>
