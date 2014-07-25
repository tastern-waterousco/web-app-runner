/**
 * @class WebAppRunner
 *
 * @author: darryl.west@roundpeg.com
 * @created: 2014-06-29
 */
var connect = require( 'connect' ),
    dash = require('lodash' ),
    IPFilter = require('./IPFilter' ),
    Visitor = require('./Visitor' ),
    serveStatic = require( 'serve-static' );

var WebAppRunner = function(options) {
    'use strict';

    var server = this,
        log = options.log,
        port = options.port,
        home = options.home || __dirname,
        env = options.env || 'development',
        startPage = options.startPage,
        ipfilter = options.ipfilter,
        daemon = dash.isBoolean( options.daemon ) ? options.daemon : false,
        app = options.app;

    /**
     * create the connect app object and add the middleware.  this is exposed to enable additional middleware
     */
    this.createApp = function() {
        if (!app) {
            log.info('start the application at port: ', port);

            app = connect();

            app.use( ipfilter.authorize );
            app.use( server.logger );

            app.use( server.landingPageRouter );

            app.use( serveStatic( home ) );
        }

        return app;
    };

    /**
     * start the server; if app is not created, then create it.
     */
    this.start = function() {
        if (!app) {
            server.createApp();
        }

        log.info('listening on port: ', port, ', from home: ', home, ', with env: ', env);
        app.listen( port );
    };

    /**
     * route the default index page
     *
     * @param request
     * @param response
     * @param next
     */
    this.landingPageRouter = function(request, response, next) {
        var url = request.url,
            html = startPage;

        if (html && (url === '/' || url.indexOf('/index.') === 0)) {
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
        var visitor = request.visitor;

        if (!visitor) {
            visitor = new Visitor( request );
            request.visitor = visitor;
        }

        log.info( 'request: ', JSON.stringify( visitor ));

        next();
    };

    // constructor validations
    if (!log) throw new Error('socket server must be constructed with a log');
    if (!port) throw new Error('socket server must be constructed with a port');

    var runInstance = function() {
        var childKey = '--run-child-service',
            args = dash.toArray( process.argv ),
            runner,
            child,
            command;

        args.shift();
        if (args[ 1 ] === childKey) {
            server.start();
        } else {
            command = args.shift();
            args.unshift( childKey );

            runner = require('background-service-runner' ).createDaemonRunner();
            child = runner.start( command, args );

            log.info('running child pid: ', child.pid);
            // now write the pid to process-port.pid
        }
    };

    if (daemon && daemon === true) {
        runInstance();
    }
};

// replace this with a bootstrap starter...
WebAppRunner.createInstance = function(opts) {
    'use strict';

    var runner,
        conf;

    if (!opts) {
        opts = {};
    } else if (opts.configFile) {
        conf = opts.configFile;

        opts = conf.readConfig();

        // assign the dynamic reader if available
        opts.readFilters = conf.readFilters;
    }

    if (!opts.log) {
        if (opts.logfile) {
            opts.log = require('simple-node-logger' ).createSimpleFileLogger( opts.logfile );
        } else {
            opts.log = require('simple-node-logger' ).createSimpleLogger();
        }
    }

    if (!opts.ipfilter) {
        opts.ipfilter = new IPFilter( opts );
    }

    if (!opts.port) {
        opts.port = 3000;
    }

    if (!opts.home) {
        opts.home = './public';
    }

    if (!opts.env) {
        opts.env = 'development';
    }

    runner = new WebAppRunner( opts );

    return runner;
};

module.exports = WebAppRunner;
