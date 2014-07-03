/**
 * @class WebAppRunnerTests
 *
 * @author: darryl.west@roundpeg.com
 * @created: 2014-06-29
 */
var should = require('chai').should(),
    dash = require('lodash'),
    log = require('simple-node-logger' ).createLogger(),
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
                'authorize',
                'isWhiteList',
                'isBlackList',
                'reject',
                'getRemoteAddress',
                'logger',
                'createVisitor',
                'landingPageRouter'
            ];

        it('should be an instance of WebAppRunner', function() {
            should.exist( server );
            server.should.be.instanceof( WebAppRunner );
        });

        it('should have all known methods by size and type', function() {
            dash.methods( server ).length.should.equal( methods.length );

            methods.forEach(function(method) {
                server[ method ].should.be.a('function');
            });
        });
    });
});
