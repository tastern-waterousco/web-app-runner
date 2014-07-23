# Web App Runner
- - -

A simple HTTP server targeted for single-page web applications.

## Overview

Simple http server plus middleware for banning or re-routing external connections by ip or agent. The server can be used stand alone or as middleware for connect or express.

## Installation

	npm install web-app-runner --save

## Use

### Basic Web Server

    // by default the server returns public/index.html
	var runner = require('web-app-runner').createInstance();

    runner.start();

### IP Filter

The following IP Filter server with accept and reject specific IP addresses.  All unknown IPs are accepted.  This is modified with the __acceptUnknownVisitor__ option parameter set to false.

	var opts = {
			whiteList:[
				'127.0.0.1',
				'173.13.151.170'
			],
			blackList:[
				'173.14.151.180'
			],
			acceptUnkownVisitor:true
		},
		runner = require('web-app-runner').createInstance( opts );
		
	runner.start();

## Tests

Tests are in place for all implemented methods. Tests are written in mocha/chai/should and include jshint rules.  To run the tests, do this:

	make test
	

	
- - -
<p><small><em>Copyright © 2014, rain city software | Version 0.90.13</em></small></p>
