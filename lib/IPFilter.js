/**
 * @class IPFilter
 *
 * @author: darryl.west@roundpeg.com
 * @created: 7/22/14 6:27 PM
 */
var dash = require( 'lodash' ),
    Visitor = require('./Visitor');

var IPFilter = function(options) {
    'use strict';

    var filter = this,
        log = options.log,
        whiteList = options.whiteList,
        blackList = options.blackList;

    this.authorize = function(request, response, next) {
        var visitor = request.visitor;

        if (!visitor) {
            visitor = new Visitor( request );
            log.info( 'create visitor: ', visitor );
        }

        if (!visitor.id) {
            visitor.id = filter.getRemoteAddress( request );
        }

        // first check the white lists
        if (filter.isWhiteList( visitor )) {
            return next();
        }

        // now check the black lists
        if (filter.isBlackList( visitor )) {
            log.info('reject the visitor: ', visitor);

            return filter.reject( request, response );
        }

        next();
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
        return true;
    };

    /**
     * return true if this visitor is in the black list
     *
     * @param visitor
     * @returns {boolean}
     */
    this.isBlackList = function(visitor) {
        return false;
    };

    /**
     * reject this request with a very slow non-error response...
     *
     * @param request
     * @param response
     */
    this.reject = function(request, response) {
        setTimeout(function() {
            response.end('thanks for stopping bye...');
        }, 5000);
    };

    // constructor validations
    if (!log) throw new Error('socket server must be constructed with a log');
};

module.exports = IPFilter;