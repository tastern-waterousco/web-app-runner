/**
 * @class WebAppRunnerTests
 *
 * @author: darryl.west@roundpeg.com
 * @created: 2014-06-29
 */
var should = require('chai').should(),
    dash = require('lodash'),
    log = require('simple-node-logger' ).createSimpleLogger(),
    WebAppRunner = require('../lib/WebAppRunner' ),
    MockChild = require( 'background-service-runner' ).mocks.MockChild;

describe('WebAppRunner', function() {
    'use strict';

    log.setLevel('fatal');

    var MockServiceRunner = function() {
        var runner = {};
        runner.start = function(command, args) {
            runner.command = command;
            runner.args = args;

            return new MockChild();
        };

        this.createDaemonRunner = function() {
            return runner;
        };
    };

    var createOptions = function() {
        var opts = {};

        opts.log = log;
        opts.port = dash.random( 1000, 20000 );

        return opts;
    };

    describe('#instance', function() {
        var server = new WebAppRunner( createOptions() ),
            methods = [
                'start',
                'createApp',
                'logger',
                'landingPageRouter',
                'shutdown',
                'stop',
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
        var server,
            opts = createOptions();

        opts.serviceRunner = new MockServiceRunner();
        server = new WebAppRunner( opts );

        it('should create a child instance and write the pid to process file', function() {
            var child = server.__protected().runInstance();

            should.exist( child );
            child.pid.should.be.above( 1000 );
        });
    });

    describe('shutdown', function() {
        it('should reject a shutdown request from non-local host ip');
        it('should issue a shutdown and stop from a local host ip');
    });

    describe('stop', function() {
        var server,
            opts = createOptions();

        opts.connection = {
            closed:false,
            close:function() {
                this.closed = true;
            }
        };

        server = new WebAppRunner( opts );

        it('should close an open connection', function() {
            server.stop();

            opts.connection.closed.should.equal( true );
        });
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
