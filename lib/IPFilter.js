/**
 * @class IPFilter
 *
 * @author: darryl.west@roundpeg.com
 * @created: 7/22/14 6:27 PM
 */
var dash = require( 'lodash' ),
    fs = require('fs' ),
    Visitor = require('./Visitor');

var IPFilter = function(options) {
    'use strict';

    var filter = this,
        log = options.log,
        rejectThrottleTime = options.rejectThrottleTime || 5000,
        rejectPage = options.rejectPage,
        acceptUnknownVisitor = dash.isBoolean( options.acceptUnknownVisitor ) ? options.acceptUnknownVisitor : true,
        whiteList = options.whiteList,
        blackList = options.blackList;

    this.authorize = function(request, response, next) {
        var visitor = request.visitor;

        if (!visitor) {
            visitor = new Visitor( request );
            request.visitor = visitor;
        }

        if (!visitor.ip) {
            visitor.ip = filter.getRemoteAddress( request );
        }

        // first check the white lists
        if (filter.isWhiteList( visitor )) {
            log.info('white listed: ', JSON.stringify( visitor ));
            return next();
        }

        // now check the black lists
        if (filter.isBlackList( visitor )) {
            log.warn('reject the visitor: ', JSON.stringify( visitor ));

            return filter.reject( request, response );
        }

        if (acceptUnknownVisitor) {
            log.info('unknown visitor: ', JSON.stringify( visitor ));

            // cache this visitor?

            return next();
        }

        filter.reject( request, response );
    };

    /**
     *
     * @param request
     * @returns {*}
     */
    this.getRemoteAddress = function(request) {
        if (request.ip) return request.ip;
        if (request._removeAddress) return request._remoteAddress;
        if (request.connection.remoteAddress) return request.connection.remoteAddress;
    };

    /**
     * return true if this visitor is in the white list
     *
     * @param visitor
     * @returns {boolean}
     */
    this.isWhiteList = function(visitor) {
        if (whiteList) {
            var idx = whiteList.indexOf( visitor.ip );
            log.info('ip: ', visitor.ip, ', idx: ', idx);
            return (idx >= 0);
        }

        return false;
    };

    /**
     * return true if this visitor is in the black list
     *
     * @param visitor
     * @returns {boolean}
     */
    this.isBlackList = function(visitor) {
        if (blackList) {
            return blackList.indexOf( visitor.ip ) >= 0;
        }

        return false;
    };

    /**
     * reject this request with a very slow non-error response...
     *
     * @param request
     * @param response
     */
    this.reject = function(request, response) {
        var visitor = request.visitor,
            msg;

        if (visitor) {
            msg = 'rejecting request from ip: ' + visitor.ip;
        } else {
            msg = 'rejecting visitor to: ' + request.url;
        }

        log.warn( msg );
        setTimeout(function() {
            if (rejectPage) {
                response.end( rejectPage );
            } else {
                response.end('thanks for stopping bye...');
            }
        }, rejectThrottleTime);
    };

    // constructor validations
    if (!log) throw new Error('socket server must be constructed with a log');
};

module.exports = IPFilter;