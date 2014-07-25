/**
 * @class WebAppRunnerTests
 *
 * @author: darryl.west@roundpeg.com
 * @created: 2014-06-29
 */
var should = require('chai').should(),
    dash = require('lodash'),
    log = require('simple-node-logger' ).createSimpleLogger(),
    WebAppRunner = require('../lib/WebAppRunner');

describe('WebAppRunner', function() {
    'use strict';

    var createOptions = function() {
        var opts = {};

        opts.log = log;
        opts.port = 9999;

        return opts;
    };

    describe('#instance', function() {
        var server = new WebAppRunner( createOptions() ),
            methods = [
                'start',
                'createApp',
                'logger',
                'landingPageRouter',
                '__protected'
            ];

        it('should be an instance of WebAppRunner', function() {
            should.exist( server );
            server.should.be.instanceof( WebAppRunner );
            server.__protected().runInstance.should.be.a('function');
        });

        it('should have all known methods by size and type', function() {
            dash.methods( server ).length.should.equal( methods.length );

            methods.forEach(function(method) {
                server[ method ].should.be.a('function');
            });
        });
    });

    describe('#runInstance', function() {
        it('should create a child instance and write the pid to process file');
    });

    describe('landingPageRouter', function() {
        it('should read the index page and write to mock response');
    });

    describe('logger', function() {
        it('should log visitors to a mock logger middleware object');
    });

    describe('createApp', function() {
        it('should create a connect app with middleware');
    });

    describe('start', function() {
        it('should create a mock app and start a mock server');
    });
});
