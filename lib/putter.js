var stream = require('stream') || require('readable-stream');
var util = require('util');
var events = require('events');
var decoder = require('base64-stream');
var knox = require('knox');

var Putter = function (options) {
    if (options) {
        this.client = options.client || knox.createClient({
            key: options.key, 
            secret: options.secret, 
            bucket: options.bucket
        });
        this.chunkSize = options.chunkSize || 1024;
        events.EventEmitter.call(this);
    } else {
        return new Error('No aws credentials or client provided');
    }
};

util.inherits(Putter, events.EventEmitter);

function getHeaders (size, mime, permission) {
    return {
        'Content-Length': size,
        'Content-Type': mime,
        'x-amz-acl': permission
    };
}

/**
 * Accepts a base64 encoded string
 * @returns stream and bytelength
 */
Putter.prototype.convert = function (string) { 
    if (!string || '') 
        return new Error('Need to provide a base64 encoded string');
    var i = 0;
    var chunkSize = this.chunkSize;
    var rs = new stream.Readable();
    rs._read = function convertRead () {
        var chunk = string.substring(i, i + chunkSize);
        rs.push(chunk);
        i += chunkSize;
        if (i >= string.length) rs.push(null);
    }
    return {
        stream: rs,
        bytelength: Buffer.byteLength(string, 'base64')
    }
};

Putter.prototype.decode = function (stream) {
    return stream.pipe(decoder.decode());
};

/**
 * Knox client error/response callback
 */
Putter.prototype.handle = function (err, res) {
    if (err) return this.emit('error', err);
    if(200 == res.statusCode) {
        this.emit('response', { path: res.req.url });
    } else {
        this.emit('error', new Error('Could not save attachment file, status code: ' + res.statusCode));
    }
};

Putter.prototype.put = function (string, path, mime, permission) {
    if (!string || !path || !mime || !permission) 
        return new Error('All arguments required');
    var self = this;
    var data = this.convert(string);
    var stream = data.stream;
    var size = data.bytelength;
    var headers = getHeaders(size, mime, permission);
    var ws = this.client.putStream(
        this.decode(stream)
      , path
      , headers
      , this.handle.bind(this)
    );
    ws.on('progress', function writeProgress (data) {
        self.emit('progress', data);
    });
    ws.on('close', function writeClose () {
        self.emit('close');
    });
};

module.exports = Putter;