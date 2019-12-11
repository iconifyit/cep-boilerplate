// #targetengine "session";

/* npm Modules */
const express    = require("express"),
      request    = require('request'),
      http       = require('http'),
      https      = require('https'),
      path       = require("path"),
      bodyParser = require("body-parser"),
      fs         = require('fs');

var app = express();

server = require('http-shutdown')(http.Server(app));

module.exports = run;

function run() {

    function setStatusMessage(message) {
        $doc.getElementById('status').innerText = message;
    }

    /* Start the server */
    server.listen(3201, function() {

        console.log("Server running on Port: " + port);

        var $doc   = window.document,
            $start = $doc.getElementById('start-server'),
            $stop  = $doc.getElementById('stop-server');

        setStatusMessage('Running on port : ' + port);

        window.addEventListener('unload', function() {
            if (typeof server === 'undefined') return;
            try {
                server.shutdown(function() {
                    console.log('Everything is cleanly shutdown.');
                });
            }
            catch(e) { console.error(e) }
        });

        $start.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            try {
                server.shutdown(function() {
                    console.log('Gracefully shutting down ...');
                    setStatusMessage('Gracefully shutting down ...');

                    server.listen(port, function() {
                        console.log('Listening on ' + port);
                        setStatusMessage('Listening on ' + port);
                    })
                });
            }
            catch(e) { console.error(e) }
        });

        $stop.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            try {
                server.shutdown(function() {
                    console.log('Gracefully shutting down ...');
                    setStatusMessage('Server is not running');
                });
            }
            catch(e) { console.error(e) }
        });
    });

    /* Middlewares */
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.use(express.static(path.join(__dirname, "../client")));

    /* /import route that can be hit from the client side */
    app.get("/import", (req, res, next) => {

        /* Get the directory path from the header and name the file */
        var path = req.headers["directory"] + "/placeholder.png"

        /* This is an example URL */
        var uri = "http://via.placeholder.com/350x150";

        /* write a helper function to download the image and save it */
        var saveImage = function(uri, filepath, callback){
            request.head(uri, function(err, res, body){
                request(uri).pipe(fs.createWriteStream(filepath)).on('close', callback);
            });
        };

        saveImage(uri, path, function(){
            /* Send the path back to the client side */
            res.status(200).send(path)
        });
    });
}