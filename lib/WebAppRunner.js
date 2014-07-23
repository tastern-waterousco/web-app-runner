/**
 * @class WebAppRunner
 *
 * @author: darryl.west@roundpeg.com
 * @created: 2014-06-29
 */
var connect = require('connect' ),
    dash = require('lodash' ),
    IPFilter = require('./IPFilter' ),
    Visitor = require('./Visitor');

var WebAppRunner = function(options) {
    'use strict';

    var server = this,
        log = options.log,
        port = options.port,
        home = options.home || __dirname,
        startPage = options.startPage,
        ipfilter = options.ipfilter,
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
            app.use( ipfilter.authorize );


            app.use( server.landingPageRouter );

            app.use( connect.static( home ) );
        }

        return app;
    };

    /**
     * start the server
     */
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

    this.logger = function(request, response, next) {
        var visitor = request.visitor || new Visitor( request );
        log.info( JSON.stringify( visitor ));

        next();
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
        opts.log = require('simple-node-logger' ).createSimpleLogger( opts.logfile );
    }

    if (!opts.ipfilter) {
        opts.ipfilter = new IPFilter( opts );
    }

    if (!opts.port) {
        opts.port = 16001;
    }

    if (!opts.startPage) {
        opts.startPage = '<!DOCTYPE html><html><head><title>Support</title></head><body>hello...</body></html>';
    }

    opts.home = './public';

    return new WebAppRunner( opts );
};

module.exports = WebAppRunner;
