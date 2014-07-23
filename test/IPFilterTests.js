/**
 * @class IPFilterTests
 *
 * @author: darryl.west@roundpeg.com
 * @created: 7/22/14 6:28 PM
 */
var should = require('chai').should(),
    dash = require('lodash'),
    log = require('simple-node-logger' ).createSimpleLogger(),
    IPFilter = require('../lib/IPFilter');

describe('IPFilter', function() {
    'use strict';

    var createOptions = function() {
        var opts = {};

        opts.log = log;

        return opts;
    };

    describe('#instance', function() {
        var filter = new IPFilter( createOptions() ),
            methods = [
                'authorize',
                'getRemoteAddress',
                'isWhiteList',
                'isBlackList',
                'reject'
            ];

        it('should be an instance of IPFilter', function() {
            should.exist( filter );
            filter.should.be.instanceof( IPFilter );
        });

        it('should have all known methods by size and type', function() {
            dash.methods( filter ).length.should.equal( methods.length );

            methods.forEach(function(method) {
                filter[ method ].should.be.a('function');
            });
        });
    });

    describe('authorize', function() {
        it('should authorize a known ip address');
        it('should reject a known ip address');
    });
});
