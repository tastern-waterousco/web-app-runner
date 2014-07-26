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
        fs = options.fs || require('fs' ),
        serviceRunner = options.serviceRunner || require('background-service-runner' ),
        port = options.port,
        home = options.home || __dirname,
        env = options.env || 'development',
        startPage = options.startPage,
        ipfilter = options.ipfilter,
        daemon = dash.isBoolean( options.daemon ) ? options.daemon : false,
        piddir = options.piddir,
        app = options.app;

    /**
     * create the connect app object and add the middleware.  this is exposed to enable additional middleware
     */
    this.createApp = function() {
        if (!app) {
            log.info('start the application at port: ', port);

            app = connect();

            app.use( function(request, response, next) {
                request.visitor = new Visitor( request );

                log.info('new visitor: ', request.visitor);

                next();
            });

            app.use( server.shutdown );
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

    this.shutdown = function(request, response, next) {
        var method = request.method,
            url = request.url,
            ip = request.ip,
            msg = 'shutting down from pid: ' + process.pid;

        log.info('shutdown request from ip: ', ip, ', url: ', url);

        if (url === '/shutdown') {


            response.writeHead(200, {
                'Content-Length': msg.length,
                'Content-Type': 'text/plain'
            });

            response.end( msg );
        } else {
            log.info('no shutdown...');
            next();
        }
    };

    /**
     * standard logger outputs the visitor in json
     *
     * @param request
     * @param response
     * @param next
     */
    this.logger = function(request, response, next) {
        var visitor = request.visitor;

        if (!visitor) {
            visitor = new Visitor( request );
            request.visitor = visitor;
        }

        log.info( 'request: ', JSON.stringify( visitor ));

        next();
    };

    /**
     * invoked when the web app is run as a daemon; override to change the format.
     *
     * @returns filename based on service port
     */
    this.createProcessPIDFile = function() {
        var filename = [ piddir, '/process-', port, '.pid' ].join('');

        log.info('process pid file for port: ', port, ', file: ', filename);

        return filename;
    };

    var runInstance = function() {
        var childKey = '--run-child-service',
            args = dash.toArray( process.argv ),
            runner,
            child,
            command,
            filename;

        args.shift();
        if (args[ 1 ] === childKey) {
            server.start();
        } else {
            command = args.shift();
            args.unshift( childKey );

            runner = serviceRunner.createDaemonRunner();
            child = runner.start( command, args );

            log.info('running child pid: ', child.pid);
            // now write the pid to process-port.pid

            filename = server.createProcessPIDFile();
        }
    };

    this.__protected = function() {
        return {
            port:port,
            piddir:piddir,
            runInstance:runInstance
        };
    };

    // constructor validations
    if (!log) throw new Error('socket server must be constructed with a log');
    if (!port) throw new Error('socket server must be constructed with a port');

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

        if (typeof conf.readFilters === 'function') {
            // assign the dynamic reader and read in

            opts.readFilters = conf.readFilters;
            opts.filters = conf.readFilters();
        }
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
