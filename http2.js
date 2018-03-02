/**
 * Created by annae on 27.02.2018.
 */
const http2 = require('http2');
const fs = require('fs');
const path = require('path');
const mime = require('mime');


const key = fs.readFileSync('localhost.key');
const cert = fs.readFileSync('localhost.cert');

const {HTTP2_HEADER_PATH} = http2.constants;

const server = http2.createSecureServer(
    {key, cert},
    onRequest
);


function onRequest(req, res) {
    console.log(req.headers[':path']);

    function onError(err) {
        if (err.code === 'ENOENT') {
            res.stream.respond({':status': 404});
        } else {
            res.stream.respond({':status': 500});
        }
        res.stream.end();
    }


    if (req.headers[':path'] === '/public/index.html') {
        res.stream.respondWithFile('./public/index.html',
            {'content-type': 'text/html'},
            {onError}
        );
    }
    else if (req.headers[':path'].indexOf('/public/app.js') != -1) {
        res.stream.respondWithFile('./public/app.js',
            {'content-type': 'application/javascript'},
            {onError}
        );
    }
    else if (req.headers[':path'] === '/public/site.css') {
        res.stream.respondWithFile('./public/site.css',
            {'content-type': 'text/css'},
            {onError}
        );
    }
    else if (req.headers[':path'] === '/') {

        res.stream.pushStream({':path': '/'}, (err, pushStream) => {
            let file = fs.readFileSync('./public/site.css');
            file += fs.readFileSync('./public/app.js');
            pushStream.end(file);
        });

        res.stream.end("some data");

    }
    else {
        res.stream.respond({':status': 404});
        res.stream.end();
    }
}

server.listen(8443);