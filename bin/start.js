#!/usr/bin/env node

var opts = {
    configFile: __dirname + '/conf.js'
};

require('../lib/WebAppRunner').createInstance( opts );

