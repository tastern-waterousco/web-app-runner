/**
 * @class WebAppRunner
 *
 * @author: darryl.west@roundpeg.com
 * @created: 2014-06-29
 */
var connect = require('connect' ),
    dash = require('lodash');

var WebAppRunner = function(options) {
    'use strict';

    var server = this,
        log = options.log,
        port = options.port,
        home = options.home || __dirname,
        startPage = options.startPage,
        app = options.app;

    /**
     * start the application listener
     */
    this.createApp = function() {
        if (!app) {
            log.info('start the application at port: ', port);

            app = connect();

            app.use( connect.favicon() );
            app.use( connect.errorHandler() );

            app.use( server.logger );
            app.use( server.landingPageRouter );
            app.use( server.authorize );

            app.use( connect.static( home ) );
        }

        return app;
    };

    this.start = function() {
        if (!app) {
            server.createApp();
        }

        log.info('listening on port: ', port);
        app.listen( port );
    };

    /**
     *
     * @param request
     * @param response
     * @param next
     */
    this.landingPageRouter = function(request, response, next) {
        var url = request.url,
            html = startPage;

        if (url === '/' || url.indexOf('/index.') === 0) {
            response.writeHead(200, {
                'Content-Length': html.length,
                'Content-Type': 'text/html'
            });

            log.debug( html );

            response.end( html );
        } else {
            next();
        }
    };

    /**
     * authorize this request by checking 1) white lists to return quickest response, 2) black lists to
     * return sleepy rejected response, 3) other that get a normal response.
     *
     * @param request
     * @param response
     * @param next
     */
    this.authorize = function(request, response, next) {
        var visitor = server.createVisitor( request );
        
        // first check the white lists
        if (server.isWhiteList( visitor )) {
            return next();
        }

        // now check the black lists
        if (server.isBlackList( visitor )) {
            log.info('reject the visitor: ', visitor);

            return server.reject( request, response );
        }

        next();
    };

    this.createVisitor = function(request) {
        var visitor = {
            url:request.url,
            ip:server.getRemoteAddress( request ),
            method:request.method,
            agent:request.headers['user-agent']
        };

        return visitor;
    };

    this.logger = function(request, response, next) {
        log.info( JSON.stringify( server.createVisitor( request ) ));

        next();
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

    this.getRemoteAddress = function(req) {
        if (req.ip) return req.ip;
        if (req._removeAddress) return req._remoteAddress;
        if (req.connection.remoteAddress) return req.connection.remoteAddress;
    };

    // constructor validations
    if (!log) throw new Error('socket server must be constructed with a log');
    if (!port) throw new Error('socket server must be constructed with a port');
};

// replace this with a bootstrap starter...
WebAppRunner.createInstance = function(opts) {
    'use strict';

    if (!opts) opts = {};

    if (!opts.log) {
        opts.log = require('simple-node-logger' ).createSimpleLogger();
    }

    if (!opts.port) {
        opts.port = 16001;
    }

    if (!opts.startPage) {
        opts.startPage = '<!DOCTYPE html><html><head><title>Support</title></head><body>hello...</body></html>';
    }

    opts.home = './examples';

    return new WebAppRunner( opts );
};

module.exports = WebAppRunner;
