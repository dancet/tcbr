// requires
const fs = require('fs');

const bunyan = require('bunyan');
const Hapi = require('hapi');

const config = require('./config.js');

// set up the logger
const log = bunyan.createLogger(config.logger.server);

// new server and routes
const server = new Hapi.Server();
server.connection({ port: config.port });

// inject a header to allow cross origin requests for all requests
server.ext('onPostHandler', function(request, reply) {
    request.response.header('Access-Control-Allow-Origin', 'http://tcbr.org.au');
    reply.continue();
});

// routes
server.route({
    method: 'GET',
    path: '/fundraising_total',
    handler: getFundraisingTotal
});

// handlers
function getFundraisingTotal(request, reply) {
    log.info(`Serving request for ${request.path}`);

    fs.readFile(config.fundraising_file, 'utf8', (err, data) => {
        if (err) {
            log.error(`Unable to read ${config.fundraising_file}. ${err}`);
            reply(0); // default to zero
        }
        else {
            reply(parseInt(data));
        }
    });

    log.info('Successfully sent response');
}

// start the server and handle errors
server.start((err) => {
    if (err) {
        log.error(`Error starting the server. ${err}`);
    }
    log.info(`Server running at: ${server.info.uri}`);
});
