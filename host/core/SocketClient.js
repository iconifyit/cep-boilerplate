
var API_TOKEN  = 'hz99DPWitBbRAgnjTrtG3rEF',
    ADDRESS    = 'api.remove.bg:443',
    xENDPOINT  = '/v1.0/apps/photoshop?v=1.3',
    ENDPOINT   = '/v1.0/account';

var METHOD = "GET";

var LF = " \r\n";

function debug(e) { alert(e) }

// https://api.remove.bg:443/v1.0/apps/photoshop?v=1.3

function SocketClient(method, address, endpoint, apiToken, success, error) {

    this.method   = method;
    this.address  = address;
    this.endpoint = endpoint;
    this.apiToken = apiToken;
    this.success  = success;
    this.error    = error;
    this.reply    = null;

    try {
        this.conn = new Socket();
        this.conn.timeout = 20000;

        if (this.conn.open(this.address, 'UTF-8')) {

            // $.writeln(this.conn);

            this[this.method.toLowerCase()].call(this);
            this.conn.close();
        }
        else {
            throw new Error('Could not open socket connection');
        }
    }
    catch(e) {
        try { this.conn.close() } catch(e){}
        debug(e.message);
    }
}

/**
 * Call Socket.get()
 */
SocketClient.prototype.get = function() {
    this.write(
        "GET " + this.endpoint + " HTTP/1.1" + LF +
        "Host : " + "api.remove.bg" + LF +
        "X-API-Key: " + this.apiToken + LF +
        "accept: */*"
    );
}

/**
 * Call Socket.post()
 */
SocketClient.prototype.post = function() {
    this.write(
        "POST " + this.endpoint + " HTTP/1.1" + LF +
        "X-API-Key: " + this.apiToken
    );
}

/**
 * Write Socket request.
 * @param request
 */
SocketClient.prototype.write = function(request) {
    try {
        if (this.conn.write(request)) {

            // $.writeln(request);

            // var n = 1;
            // while (this.conn.connected && ! this.conn.eof) {
            //     this.reply += ' [' + n + '] ' + this.conn.read(1024) + LF;
            //     n++;
            // }

            this.reply = this.conn.read(999999);

            this.conn.close();
        }
        else if (this.conn.error) {
            debug('[ERROR 1] ' + this.conn.error);
        }

        try { this.conn.close() } catch(e){}

        if (this.reply.indexOf( "200 OK" ) > 0) {
            if (this.success instanceof Function) {
                this.success.call(this, this.reply);
            }
        }
        else {
            if (this.error instanceof Function) {
                this.error.call(this, new Error('Could not connect to host'));
            }
        }
    }
    catch(e) {
        debug(e.message);
    }
}

SocketClient.prototype.isError = function() {
    return this.conn.error !== null;
}

try {
    var s = new SocketClient(
        METHOD,
        ADDRESS,
        ENDPOINT,
        API_TOKEN,
        function(){},
        function(){}
    );
    alert(s.reply.httpResponse);
}
catch(e) { debug(e) }

// IDEA : Create proxy server in NodeJS to query API. Use Socket to query local proxy server.

function testBridgeTalk() {
    var doc = app.activeDocument;

    function loadUrl(url, callback) {

        try {
            var bt = new BridgeTalk();
            bt.target = 'bridge' ;

            var s = '';
            s += "if ( !ExternalObject.webaccesslib ) {\n";
            s += "  ExternalObject.webaccesslib = new ExternalObject('lib:webaccesslib');\n";
            s += "}\n";
            s += "var html = '';\n";
            s += "var http = new HttpConnection('" + url + "') ; \n";
            s += "http.response = html;\n";
            s += "http.execute() ;\n";
            s += "http.response;\n";

            bt.body = s;

            bt.onResult = function( inBT ) {
                callback( null, inBT.body );
            };
            bt.onError = function( inBT ) { callback( 1, null ); };
            bt.send( 50 );
        }
        catch(e) {
            alert(e);
        }
    }

    function done( err, data ) {
        if ( err ) {
            alert( 'FAILED' );
        }
        else {
            alert( data );
        }
    }

    try {
        loadUrl( 'https://api.remove.bg/v1.0/apps/photoshop?v=1.3', done );
    }
    catch(e) { alert(e) }
}

// testBridgeTalk();