# Web App Runner To Do List
- - -

## General

* add visitor middleware to pull ip, url, method, agent, etc
* add shutdown hook: http://127.0.0.1:port/shutdown?token=appkey
* add a process status hook: /status?token=appkey
* implement stop.js by reading the process-port.pid file(s) and sending a kill message
* implement dynamic filter read capability
* add status.js to read the process pid and report status?
* modify to use socket logger for multiple servers
* implement agent filter

## Documentation

* implement more robust tests for start, createApp, landingPageRouter
* implement run instance tests against mock service runner
* better examples including a multi-server implementation

- - -
<p><small><em>last updated July 25, 2014</em></small></p>
