#!/usr/bin/env node

/**
* Module dependencies.
*/

var app = require('./app');
var debug = require('debug')('server:httpd');
var http = require('http');
var settings = require(__dirname + '/config/settings.js');

app.set('port', settings.listen_port);
var server = http.createServer(app);
server.listen(settings.listen_port);
server.on('error', onError);
server.on('listening', onListening);

/**
* Event listener for HTTP server "error" event.
*/

function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	var bind = typeof settings.listen_port === 'string'
	? 'Pipe ' + settings.listen_port
	: 'Port ' + settings.listen_port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

/**
* Event listener for HTTP server "listening" event.
*/

function onListening() {
	var addr = server.address();
	var bind = typeof addr === 'string'
	? 'pipe ' + addr
	: 'port ' + addr.port;
	debug('Listening on ' + bind);
}
