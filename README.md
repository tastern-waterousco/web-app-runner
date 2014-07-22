excommunicator
==============

## Overview

Simple http server plus middleware for banning or re-routing external connections by ip or agent. The server can be used stand alone or as middleware for connect or express.

## Installation

	npm install excommunicator --save

## Testing And Examples

Basic testing is in place for all implemented methods.  Examples can be found under ./examples.

# API

## constructor

	// create a simple banning server
    // by default looks for ./index.html or public/index.html
	var app = require('excommunicator').createInstance();

    app.listen( 3009 );
	
- - -
<p><small><em>Copyright © 2014, rain city software | Version 0.90.12</em></small></p>
