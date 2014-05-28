var should = require('should');
var knox = require('knox');
var base64string = require('./helper').base64string;
var Putter = require('../index.js');
var options = {
    key: '1234'
  , secret: '1234'
  , bucket: 'sample'
  , chunkSize: 128
}
var knoxClient = knox.createClient({
    key: options.key, 
    secret: options.secret, 
    bucket: options.bucket
});

describe('Putter', function () {

    describe('constructor', function () {
        it('should return streamer instance with new knox client', function (done) {
            var putter = new Putter(options);
            putter.client.should.be.an.Object;
            putter.client.should.be.instanceof.Putter;
            putter.should.have.property('client');
            putter.should.have.property('chunkSize', 128);
            done();
        });
        it('should return streamer instance with passed knox client', function (done) {
            var putter = new Putter({ client: knoxClient, chunkSize: options.chunkSize });
            putter.client.should.be.an.Object;
            putter.client.should.be.instanceof.Putter;
            putter.should.have.property('client');
            putter.client.should.have.property('putStream');
            putter.should.have.property('chunkSize', 128);
            done();
        });
        it('should return an error for no options', function (done) {
            var putter = new Putter();
            putter.should.be.an.Error;
            done();
        });
    });

    describe('convert', function () {
        it('should return a readable stream for a string and its decoded bytelength', function (done) {
            var putter = new Putter(options);
            var data = putter.convert(base64string);
            var stream = data.stream;
            var length = data.bytelength;
            stream.should.be.an.Object;
            stream.should.have.property('readable', true);
            length.should.be.a.Number;
            length.should.be.above(0);
            done();
        });
        it('should return an error for no string or empty string', function (done) {
            var putter = new Putter(options);
            var data = putter.convert();
            data.should.be.an.Error;
            done();
        });
    });

    describe('put', function () {
        it('should return an error if any argument is not provided', function (done) {
            var putter = new Putter(options);
            var data = putter.put();
            data.should.be.an.Error;
            done();
        });
    });

});